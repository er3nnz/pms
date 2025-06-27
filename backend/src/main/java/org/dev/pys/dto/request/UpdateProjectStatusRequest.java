package org.dev.pys.dto.request;

import jakarta.validation.constraints.NotNull;
import org.dev.pys.enumarate.ProjectStatus;

public record UpdateProjectStatusRequest(
        @NotNull(message = "Yeni durum zorunludur")
        ProjectStatus status
) {
}
