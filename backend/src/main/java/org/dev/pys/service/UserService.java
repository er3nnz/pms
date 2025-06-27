package org.dev.pys.service;

import org.dev.pys.dto.request.UpdateEmailRequest;
import org.dev.pys.dto.request.UpdatePasswordRequest;
import org.dev.pys.dto.request.UpdateProfileRequest;
import org.dev.pys.dto.request.UpdateUserRequest;
import org.dev.pys.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse findByUsername(String username);

    List<UserResponse> findAllUsers();

    UserResponse updateUser(String username, UpdateUserRequest request);

    UserResponse updateEmail(String username, UpdateEmailRequest request);

    UserResponse updateUserById(Long id, UpdateUserRequest request);

    void deleteUser(Long id);

    UserResponse updatePassword(String username, UpdatePasswordRequest request);

    UserResponse updateUserProfile(String username, UpdateProfileRequest request);

    UserResponse getUserById(Long id);

}
