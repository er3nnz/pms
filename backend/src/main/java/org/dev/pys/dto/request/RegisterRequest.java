package org.dev.pys.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record RegisterRequest(
        @NotBlank(message = "Kullanıcı adı zorunludur")
        @Size(min = 3, max = 50)
        String username,

        @NotBlank(message = "Şifre zorunludur")
        @Size(min = 6, max = 100)
        String password,

        @NotBlank(message = "Email zorunludur")
        @Email(message = "Geçerli bir email adresi girin")
        String email,

        @NotBlank(message = "Ad zorunludur")
        String firstName,

        @NotBlank(message = "Soyad zorunludur")
        String lastName,

        String position,

        Set<String> roles
) {
}
