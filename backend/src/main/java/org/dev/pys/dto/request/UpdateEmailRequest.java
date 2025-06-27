package org.dev.pys.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateEmailRequest(
        @NotBlank(message = "Email boş bırakılamaz")
        @Email(message = "Geçerli bir email adresi girin")
        String email
) {
}

