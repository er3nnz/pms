package org.dev.pys.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public record UpdateUserRequest(
        @NotBlank(message = "Ad Soyad zorunludur")
        String fullName,

        String position,

        Set<String> roles
) {
}

