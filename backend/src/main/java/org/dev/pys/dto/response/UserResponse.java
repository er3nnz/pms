package org.dev.pys.dto.response;

import java.util.Set;

public record UserResponse(
        Long id,
        String username,
        String fullName,
        String email,
        String position,
        Set<String> roles
) {}

