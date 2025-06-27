package org.dev.pys.dto.response;

import java.util.Set;

public record LoginResponse(
        Long id,
        String username,
        String fullName,
        Set<String> roles,
        String token
) {
}