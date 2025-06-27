package org.dev.pys.dto.request;

import java.time.LocalDate;

public record UpdateAssignmentRequest(
        Long newEmployeeId,
        LocalDate newAssignedDate
) {
}