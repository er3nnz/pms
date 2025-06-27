package org.dev.pys.controller;

import jakarta.validation.Valid;
import org.dev.pys.dto.request.UpdateEmailRequest;
import org.dev.pys.dto.request.UpdatePasswordRequest;
import org.dev.pys.dto.request.UpdateProfileRequest;
import org.dev.pys.dto.request.UpdateUserRequest;
import org.dev.pys.dto.response.UserResponse;
import org.dev.pys.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYEE', 'ROLE_MANAGER')")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponse userResponse = userService.findByUsername(userDetails.getUsername());
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYEE', 'ROLE_MANAGER')")
    public ResponseEntity<UserResponse> updateUserProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                          @Valid @RequestBody UpdateProfileRequest request) {
        UserResponse updatedUser = userService.updateUserProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/me/email")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYEE', 'ROLE_MANAGER')")
    public ResponseEntity<UserResponse> updateEmail(@AuthenticationPrincipal UserDetails userDetails,
                                                    @Valid @RequestBody UpdateEmailRequest request) {
        UserResponse updatedUser = userService.updateEmail(userDetails.getUsername(), request);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> responses = userService.findAllUsers();
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<UserResponse> updateUserById(@PathVariable Long id,
                                                       @Valid @RequestBody UpdateUserRequest request) {
        UserResponse updatedUser = userService.updateUserById(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/me/password")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYEE', 'ROLE_MANAGER')")
    public ResponseEntity<UserResponse> updatePassword(@AuthenticationPrincipal UserDetails userDetails,
                                                       @Valid @RequestBody UpdatePasswordRequest request) {
        UserResponse updatedUser = userService.updatePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }
}
