package org.dev.pys.dto.response;

import java.time.LocalDate;

public record AssignmentResponse(
        Long assignmentId,
        Long projectId,
        String projectName,
        String projectDescription,
        Long employeeId,
        String employeeName,
        LocalDate assignedDate
) {
}
