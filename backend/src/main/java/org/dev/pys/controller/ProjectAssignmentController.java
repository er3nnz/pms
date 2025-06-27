package org.dev.pys.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.dev.pys.dto.request.AssignEmployeeRequest;
import org.dev.pys.dto.request.UpdateAssignmentRequest;
import org.dev.pys.dto.response.AssignmentResponse;
import org.dev.pys.entity.User;
import org.dev.pys.repository.UserRepository;
import org.dev.pys.service.ProjectAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectAssignmentController {

    private final ProjectAssignmentService assignmentService;
    private final UserRepository userRepository;

    @PostMapping("{projectId}/assign")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<AssignmentResponse> assignEmployeeToProject(
            @PathVariable Long projectId,
            @Valid @RequestBody AssignEmployeeRequest request) {

        AssignmentResponse resp = assignmentService.assignEmployee(projectId, request);
        return ResponseEntity.status(201).body(resp);
    }

    @GetMapping("{projectId}/employees")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<List<AssignmentResponse>> listEmployeesByProject(@PathVariable Long projectId) {
        List<AssignmentResponse> list = assignmentService.getAssignmentsByProject(projectId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYEE','ROLE_MANAGER')")
    public ResponseEntity<List<AssignmentResponse>> listMyProjects(@AuthenticationPrincipal UserDetails details) {
        User user = userRepository.findByUsername(details.getUsername())
                .orElseThrow();
        Long employeeId = user.getEmployee().getId();
        List<AssignmentResponse> list = assignmentService.getAssignmentsByEmployee(employeeId);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/assignments/{assignmentId}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<AssignmentResponse> updateAssignment(
            @PathVariable Long assignmentId,
            @Valid @RequestBody UpdateAssignmentRequest request) {

        AssignmentResponse resp = assignmentService.updateAssignment(assignmentId, request);
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/assignments/{assignmentId}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<Void> unassignEmployee(@PathVariable Long assignmentId) {
        assignmentService.unassignEmployee(assignmentId);
        return ResponseEntity.noContent().build();
    }
    
}
