package org.dev.pys.service;

import org.dev.pys.dto.request.AssignEmployeeRequest;
import org.dev.pys.dto.request.UpdateAssignmentRequest;
import org.dev.pys.dto.response.AssignmentResponse;

import java.util.List;

public interface ProjectAssignmentService {

    AssignmentResponse assignEmployee(Long projectId, AssignEmployeeRequest request);

    List<AssignmentResponse> getAssignmentsByProject(Long projectId);

    List<AssignmentResponse> getAssignmentsByEmployee(Long employeeId);

    AssignmentResponse updateAssignment(Long assignmentId, UpdateAssignmentRequest request);

    void unassignEmployee(Long assignmentId);
}
