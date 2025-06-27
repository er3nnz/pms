package org.dev.pys.dto.response;

import java.util.Set;

public record RegisterResponse(
        Long id,
        String username,
        String fullName,
        Set<String> roles
) {
}
