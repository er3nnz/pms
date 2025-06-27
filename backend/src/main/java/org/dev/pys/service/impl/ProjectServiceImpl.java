package org.dev.pys.service.impl;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.dev.pys.dto.mapper.ProjectMapper;
import org.dev.pys.dto.request.CreateProjectRequest;
import org.dev.pys.dto.request.UpdateProjectRequest;
import org.dev.pys.dto.request.UpdateProjectStatusRequest;
import org.dev.pys.dto.response.ProjectResponse;
import org.dev.pys.entity.Project;
import org.dev.pys.entity.ProjectAssignment;
import org.dev.pys.entity.User;
import org.dev.pys.enumarate.ProjectStatus;
import org.dev.pys.exception.AuthExceptions.UnauthorizedException;
import org.dev.pys.exception.CommonExceptions.BadRequestException;
import org.dev.pys.exception.CommonExceptions.ResourceNotFoundException;
import org.dev.pys.repository.ProjectAssignmentRepository;
import org.dev.pys.repository.ProjectRepository;
import org.dev.pys.repository.UserRepository;
import org.dev.pys.service.AuditLogService;
import org.dev.pys.service.ProjectService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public ProjectServiceImpl(ProjectRepository projectRepository, ProjectAssignmentRepository assignmentRepository,
                              UserRepository userRepository, AuditLogService auditLogService) {
        this.projectRepository = projectRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    public ProjectResponse createProject(CreateProjectRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw new BadRequestException("Proje adı zorunludur.");
        }
        if (request.startDate() == null || request.endDate() == null) {
            throw new BadRequestException("Başlangıç ve bitiş tarihleri zorunludur");
        }
        if (request.startDate().isAfter(request.endDate())) {
            throw new BadRequestException("Başlangıç tarihi bitiş tarihinden büyük olamaz");
        }
        LocalDate today = LocalDate.now();
        if (request.startDate().isBefore(today) || request.endDate().isBefore(today)) {
            throw new BadRequestException("Geçmiş tarihli proje oluşturulamaz");
        }

        Project project = ProjectMapper.toEntity(request);
        Project saved = projectRepository.save(project);
        auditLogService.log(getCurrentUser().getUsername(),
                "CREATE_PROJECT", "Proje oluşturuldu: " + saved.getName());
        return ProjectMapper.toProjectResponse(saved);
    }

    @Override
    public ProjectResponse updateProject(Long id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proje bulunamadı id: " + id));

        if (request.name() != null && request.name().isBlank()) {
            throw new BadRequestException("Proje adı boş bırakılamaz.");
        }
        if (request.startDate() != null && request.endDate() != null &&
                request.startDate().isAfter(request.endDate())) {
            throw new BadRequestException("Başlangıç tarihi bitiş tarihinden büyük olamaz");
        }

        LocalDate today = LocalDate.now();
        if ((request.startDate() != null && request.startDate().isBefore(today)) ||
                (request.endDate()   != null && request.endDate().isBefore(today))) {
            throw new BadRequestException("Geçmiş tarihli güncelleme yapılamaz");
        }

        project.setName(request.name() != null ? request.name() : project.getName());
        project.setDescription(request.description() != null ? request.description() : project.getDescription());
        project.setStartDate(request.startDate() != null ? request.startDate() : project.getStartDate());
        project.setEndDate(request.endDate() != null ? request.endDate() : project.getEndDate());

        if (request.status() != null) {
            project.setStatus(request.status());
        }

        Project updated = projectRepository.save(project);
        auditLogService.log(getCurrentUser().getUsername(), "UPDATE_PROJECT",
                "Proje güncellendi: " + updated.getName());
        return ProjectMapper.toProjectResponse(updated);
    }

    @Override
    public ProjectResponse getProjectById(Long id) {
        log.info("[GET_PROJECT] Proje getiriliyor - id: {}", id);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proje bulunamadı id: " + id));

        User current = getCurrentUser();

        if (!isManager(current)) {
            Long empId = current.getEmployee().getId();
            boolean assigned = assignmentRepository
                    .findByProject_IdAndEmployee_Id(id, empId)
                    .isPresent();
            if (!assigned) {
                log.warn("[GET_PROJECT] Erişim reddedildi - employeeId: {}, projectId: {}", empId, id);
                throw new UnauthorizedException("Bu projeye atanmadınız");
            }
        }
        return ProjectMapper.toProjectResponse(project);
    }

    @Override
    public List<ProjectResponse> getAllProjects() {
        log.info("[GET_ALL_PROJECTS] Proje listesi isteniyor");
        User current = getCurrentUser();

        List<Project> projects = isManager(current) ?
                projectRepository.findAll() :
                assignmentRepository.findByEmployee_Id(current.getEmployee().getId())
                        .stream()
                        .map(ProjectAssignment::getProject)
                        .toList();

        return projects.stream()
                .map(ProjectMapper::toProjectResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proje bulunamadı id: " + id));
        projectRepository.delete(project);
        auditLogService.log(getCurrentUser().getUsername(), "DELETE_PROJECT", "Proje silindi: " + project.getName());
    }

    @Override
    public ProjectResponse updateProjectStatus(Long id, UpdateProjectStatusRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proje bulunamadı id: " + id));

        if (project.getStatus() == request.status()) {
            throw new BadRequestException("Proje zaten '" + request.status() + "' durumunda");
        }

        if (project.getStatus() == ProjectStatus.COMPLETED) {
            throw new BadRequestException("Tamamlanmış proje yeniden başlatılamaz");
        }

        if (project.getStatus() == ProjectStatus.INCOMPLETE &&
                request.status() == ProjectStatus.IN_PROGRESS) {
            throw new BadRequestException("INCOMPLETE proje tekrar IN_PROGRESS olamaz");
        }

        ProjectMapper.updateStatus(project, request);
        Project saved = projectRepository.save(project);
        auditLogService.log(getCurrentUser().getUsername(), "UPDATE_PROJECT_STATUS",
                "Proje durumu güncellendi: " + saved.getName() + " -> " + saved.getStatus());
        return ProjectMapper.toProjectResponse(saved);
    }

    private boolean isManager(User user) {
        return user.getRoles().stream()
                .anyMatch(r -> r.name().equals("ROLE_MANAGER"));
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Kullanıcı bulunamadı"));
    }
}

