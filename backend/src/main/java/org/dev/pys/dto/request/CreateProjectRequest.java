package org.dev.pys.dto.request;

import java.time.LocalDate;

public record CreateProjectRequest(
        String name,
        String description,
        LocalDate startDate,
        LocalDate endDate
) {}
