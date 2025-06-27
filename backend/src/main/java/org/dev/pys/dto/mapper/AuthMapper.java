package org.dev.pys.dto.mapper;

import org.dev.pys.dto.request.RegisterRequest;
import org.dev.pys.dto.response.RegisterResponse;
import org.dev.pys.dto.response.LoginResponse;
import org.dev.pys.entity.Employee;
import org.dev.pys.entity.User;

import java.util.Set;
import java.util.stream.Collectors;

public class AuthMapper {

    public static User toUser(RegisterRequest request) {
        Set<org.dev.pys.enumarate.Role> roles;
        if (request.roles() == null || request.roles().isEmpty()) {
            roles = Set.of(org.dev.pys.enumarate.Role.ROLE_EMPLOYEE);
        } else {
            roles = request.roles().stream()
                    .map(role -> org.dev.pys.enumarate.Role.valueOf(role.toUpperCase()))
                    .collect(Collectors.toSet());
        }

        Employee employee = Employee.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .position(request.position())
                .build();

        User user = User.builder()
                .username(request.username())
                .password(request.password())
                .roles(roles)
                .employee(employee)
                .build();
        employee.setUser(user);

        return user;
    }

    public static RegisterResponse toRegisterResponse(User user) {
        return new RegisterResponse(
                user.getId(),
                user.getUsername(),
                user.getEmployee().getFirstName() + " " + user.getEmployee().getLastName(),
                user.getRoles().stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet())
        );
    }

    public static LoginResponse toLoginResponse(User user, String token) {
        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getEmployee().getFirstName() + " " + user.getEmployee().getLastName(),
                user.getRoles().stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet()),
                token
        );
    }
}
