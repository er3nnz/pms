package org.dev.pys.dto.response;

import org.dev.pys.enumarate.ProjectStatus;

import java.time.LocalDate;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        ProjectStatus status
) {}
