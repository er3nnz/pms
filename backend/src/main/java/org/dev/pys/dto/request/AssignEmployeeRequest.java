package org.dev.pys.dto.request;

import jakarta.validation.constraints.NotNull;

public record AssignEmployeeRequest(
        @NotNull(message = "Çalışan ID zorunludur")
        Long employeeId
) {}
