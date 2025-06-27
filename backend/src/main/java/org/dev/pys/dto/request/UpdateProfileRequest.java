package org.dev.pys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
        @NotBlank(message = "Ad Soyad zorunludur")
        String fullName,

        String position
) {}
