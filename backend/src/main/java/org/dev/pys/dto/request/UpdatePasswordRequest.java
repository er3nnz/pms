package org.dev.pys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePasswordRequest(
        @NotBlank(message = "Eski şifre zorunludur")
        String oldPassword,

        @NotBlank(message = "Yeni şifre zorunludur")
        @Size(min = 6, message = "Yeni şifre en az 6 karakter olmalı")
        String newPassword
) {
}
