package org.dev.pys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Kullanıcı adı alanı boş bırakılamaz")
        String credential,

        @NotBlank(message = "Şifre alanı boş bırakılamaz")
        String password
) {}