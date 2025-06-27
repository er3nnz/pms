package org.dev.pys.dto.mapper;

import org.dev.pys.dto.response.AssignmentResponse;
import org.dev.pys.entity.ProjectAssignment;

public class ProjectAssignmentMapper {

    public static AssignmentResponse toResponse(ProjectAssignment pa) {
        return new AssignmentResponse(
                pa.getId(),
                pa.getProject().getId(),
                pa.getProject().getName(),
                pa.getProject().getDescription(),
                pa.getEmployee().getId(),
                pa.getEmployee().getFirstName() + " " + pa.getEmployee().getLastName(),
                pa.getAssignedDate()
        );
    }
}
