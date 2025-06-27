package org.dev.pys.dto.request;

import org.dev.pys.enumarate.ProjectStatus;

import java.time.LocalDate;

public record UpdateProjectRequest(
        String name,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        ProjectStatus status
) {}
