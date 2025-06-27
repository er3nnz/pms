package org.dev.pys.dto.mapper;

import org.dev.pys.dto.request.UpdateEmailRequest;
import org.dev.pys.dto.request.UpdateUserRequest;
import org.dev.pys.dto.response.UserResponse;
import org.dev.pys.entity.User;

import java.util.Set;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserResponse toUserResponse(User user) {
        String fullName = user.getEmployee().getFirstName() + " " + user.getEmployee().getLastName();
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                fullName,
                user.getEmployee().getEmail(),
                user.getEmployee().getPosition(),
                user.getRoles().stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet())
        );
    }

    public static void updateUserFromRequest(User user, UpdateUserRequest request) {
        String[] names = request.fullName().split(" ", 2);
        if (names.length == 2) {
            user.getEmployee().setFirstName(names[0]);
            user.getEmployee().setLastName(names[1]);
        } else {
            user.getEmployee().setFirstName(request.fullName());
            user.getEmployee().setLastName("");
        }
        user.getEmployee().setPosition(request.position());

        Set<org.dev.pys.enumarate.Role> updatedRoles = request.roles() != null
                ? request.roles().stream()
                .map(role -> org.dev.pys.enumarate.Role.valueOf(role.toUpperCase()))
                .collect(Collectors.toSet())
                : user.getRoles();

        user.setRoles(updatedRoles);
    }

    public static void updateEmail(User user, UpdateEmailRequest request) {
        user.getEmployee().setEmail(request.email());
    }
}
