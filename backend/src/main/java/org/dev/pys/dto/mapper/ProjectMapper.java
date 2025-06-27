package org.dev.pys.dto.mapper;

import org.dev.pys.dto.request.UpdateProjectStatusRequest;
import org.dev.pys.entity.Project;
import org.dev.pys.dto.request.CreateProjectRequest;
import org.dev.pys.dto.request.UpdateProjectRequest;
import org.dev.pys.dto.response.ProjectResponse;
import org.dev.pys.enumarate.ProjectStatus;

public class ProjectMapper {

    public static Project toEntity(CreateProjectRequest request) {
        return Project.builder()
                .name(request.name())
                .description(request.description())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .status(ProjectStatus.NEW)
                .build();
    }

    public static void updateEntityFromRequest(Project project, UpdateProjectRequest request) {
        if (request.name() != null) project.setName(request.name());
        if (request.description() != null) project.setDescription(request.description());
        if (request.startDate() != null) project.setStartDate(request.startDate());
        if (request.endDate() != null) project.setEndDate(request.endDate());
        if (request.status() != null) project.setStatus(request.status());
    }

    public static ProjectResponse toProjectResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStartDate(),
                project.getEndDate(),
                project.getStatus()
        );
    }

    public static void updateStatus(Project project, UpdateProjectStatusRequest req) {
        project.setStatus(req.status());
    }
}
