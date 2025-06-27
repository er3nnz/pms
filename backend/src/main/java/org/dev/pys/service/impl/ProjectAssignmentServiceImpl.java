package org.dev.pys.service.impl;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.dev.pys.dto.mapper.ProjectAssignmentMapper;
import org.dev.pys.dto.request.AssignEmployeeRequest;
import org.dev.pys.dto.request.UpdateAssignmentRequest;
import org.dev.pys.dto.response.AssignmentResponse;
import org.dev.pys.entity.Employee;
import org.dev.pys.entity.Project;
import org.dev.pys.entity.ProjectAssignment;
import org.dev.pys.entity.User;
import org.dev.pys.enumarate.ProjectStatus;
import org.dev.pys.exception.CommonExceptions.BadRequestException;
import org.dev.pys.exception.CommonExceptions.ResourceNotFoundException;
import org.dev.pys.repository.ProjectAssignmentRepository;
import org.dev.pys.repository.ProjectRepository;
import org.dev.pys.repository.UserRepository;
import org.dev.pys.service.AuditLogService;
import org.dev.pys.service.ProjectAssignmentService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class ProjectAssignmentServiceImpl implements ProjectAssignmentService {

    private final ProjectRepository projectRepository;
    private final ProjectAssignmentRepository assignmentRepository;
    private final AuditLogService auditLogService;
    private final UserRepository userRepository;

    public ProjectAssignmentServiceImpl(ProjectRepository projectRepository,
                                        ProjectAssignmentRepository assignmentRepository, AuditLogService auditLogService,
                                        UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.assignmentRepository = assignmentRepository;
        this.auditLogService = auditLogService;
        this.userRepository = userRepository;
    }

    @Override
    public AssignmentResponse assignEmployee(Long projectId, AssignEmployeeRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Proje bulunamadı: " + projectId));

        if (project.getEndDate() != null && project.getEndDate().isBefore(LocalDate.now())
                || project.getStatus() == ProjectStatus.INCOMPLETE
                || project.getStatus() == ProjectStatus.COMPLETED) {
            throw new BadRequestException("Süresi geçmiş projeye çalışan atanamaz");
        }

        User user = userRepository.findById(request.employeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + request.employeeId()));
        if (user.getEmployee() == null) {
            throw new BadRequestException("Bu kullanıcıya bağlı çalışan kaydı yok");
        }
        Employee employee = user.getEmployee();

        assignmentRepository.findByProject_IdAndEmployee_Id(projectId, employee.getId())
                .ifPresent(a -> {
                    throw new BadRequestException("Çalışan zaten bu projeye atanmış");
                });

        ProjectAssignment pa = ProjectAssignment.builder()
                .project(project)
                .employee(employee)
                .assignedDate(LocalDate.now())
                .build();

        ProjectAssignment saved = assignmentRepository.save(pa);
        auditLogService.log(currentUser(), "ASSIGN_EMPLOYEE",
                "userId=" + user.getId() + ", projectId=" + projectId);
        return ProjectAssignmentMapper.toResponse(saved);
    }

    @Override
    public AssignmentResponse updateAssignment(Long assignmentId, UpdateAssignmentRequest request) {
        ProjectAssignment pa = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Atama bulunamadı id=" + assignmentId));

        Project project = pa.getProject();
        if ((project.getEndDate() != null && project.getEndDate().isBefore(LocalDate.now())) ||
                project.getStatus() == ProjectStatus.INCOMPLETE ||
                project.getStatus() == ProjectStatus.COMPLETED) {
            throw new BadRequestException("Süresi geçmiş projede atama güncellenemez");
        }

        boolean updated = false;

        if (request.newEmployeeId() != null) {
            Long currentEmpId = pa.getEmployee().getId();
            if (request.newEmployeeId().equals(currentEmpId)) {
                throw new BadRequestException("Çalışan zaten bu projeye atanmış");
            }
            User newUser = userRepository.findById(request.newEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + request.newEmployeeId()));
            if (newUser.getEmployee() == null) {
                throw new BadRequestException("Bu kullanıcıya bağlı çalışan kaydı yok");
            }
            Employee newEmp = newUser.getEmployee();
            assignmentRepository.findByProject_IdAndEmployee_Id(project.getId(), newEmp.getId())
                    .ifPresent(a -> {
                        throw new BadRequestException("Yeni kullanıcı zaten bu projeye atanmış");
                    });
            pa.setEmployee(newEmp);
            updated = true;
        }

        if (request.newAssignedDate() != null && !request.newAssignedDate().equals(pa.getAssignedDate())) {
            if (request.newAssignedDate().isBefore(project.getStartDate()) ||
                    request.newAssignedDate().isAfter(project.getEndDate())) {
                throw new BadRequestException("Atama tarihi proje tarih aralığında olmalı");
            }
            pa.setAssignedDate(request.newAssignedDate());
            updated = true;
        }

        if (!updated) {
            throw new BadRequestException("Herhangi bir değişiklik yapılmadı");
        }

        ProjectAssignment saved = assignmentRepository.save(pa);
        auditLogService.log(currentUser(), "UPDATE_ASSIGNMENT", "assignmentId=" + assignmentId);
        return ProjectAssignmentMapper.toResponse(saved);
    }

    @Override
    public void unassignEmployee(Long assignmentId) {
        ProjectAssignment pa = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Atama bulunamadı id=" + assignmentId));

        if (pa.getProject().getStatus() == ProjectStatus.COMPLETED) {
            throw new BadRequestException("Tamamlanmış projede atama silinemez");
        }
        assignmentRepository.delete(pa);
        auditLogService.log(currentUser(), "UNASSIGN_EMPLOYEE", "assignmentId=" + assignmentId);
    }

    @Override
    public List<AssignmentResponse> getAssignmentsByProject(Long projectId) {
        List<ProjectAssignment> list = assignmentRepository.findByProject_Id(projectId);
        return list.stream()
                .map(ProjectAssignmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentResponse> getAssignmentsByEmployee(Long employeeId) {
        List<ProjectAssignment> list = assignmentRepository.findByEmployee_Id(employeeId);
        return list.stream()
                .map(ProjectAssignmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    private String currentUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}

