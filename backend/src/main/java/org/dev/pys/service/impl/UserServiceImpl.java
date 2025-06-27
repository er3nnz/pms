package org.dev.pys.service.impl;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.dev.pys.dto.request.UpdateEmailRequest;
import org.dev.pys.dto.request.UpdatePasswordRequest;
import org.dev.pys.dto.request.UpdateProfileRequest;
import org.dev.pys.dto.request.UpdateUserRequest;
import org.dev.pys.dto.mapper.UserMapper;
import org.dev.pys.dto.response.UserResponse;
import org.dev.pys.entity.User;
import org.dev.pys.enumarate.Role;
import org.dev.pys.exception.CommonExceptions.BadRequestException;
import org.dev.pys.exception.CommonExceptions.ResourceNotFoundException;
import org.dev.pys.exception.UserExceptions.InvalidPasswordException;
import org.dev.pys.repository.UserRepository;
import org.dev.pys.service.AuditLogService;
import org.dev.pys.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder,
                           AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @Override
    public UserResponse findByUsername(String username) {
        log.info("[USER SERVICE] Kullanıcı aranıyor - username: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.warn("[USER SERVICE] Kullanıcı bulunamadı - username: {}", username);
                    return new ResourceNotFoundException("Kullanıcı bulunamadı");
                });
        return UserMapper.toUserResponse(user);
    }

    @Override
    public List<UserResponse> findAllUsers() {
        log.info("[USER SERVICE] Tüm kullanıcılar listeleniyor");
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse updateUser(String username, UpdateUserRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        UserMapper.updateUserFromRequest(user, request);
        ensureDefaultEmployeeRole(user);
        User updatedUser = userRepository.save(user);
        auditLogService.log(username, "UPDATE_USER", "Kullanıcı bilgileri güncellendi.");
        return UserMapper.toUserResponse(updatedUser);
    }

    @Override
    public UserResponse updateUserById(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        UserMapper.updateUserFromRequest(user, request);
        ensureDefaultEmployeeRole(user);
        User updatedUser = userRepository.save(user);
        auditLogService.log(user.getUsername(), "UPDATE_USER", "Kullanıcı bilgileri güncellendi (id ile).");
        return UserMapper.toUserResponse(updatedUser);
    }

    @Override
    public UserResponse updateEmail(String username, UpdateEmailRequest request) {
        log.info("[USER SERVICE] Kullanıcı email güncelleniyor - username: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        UserMapper.updateEmail(user, request);
        User updatedUser = userRepository.save(user);
        auditLogService.log(username, "UPDATE_EMAIL", "Kullanıcı e-posta adresini güncelledi.");
        log.info("[USER SERVICE] Kullanıcı email güncellendi - username: {}", username);
        return UserMapper.toUserResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı id: " + id));
        userRepository.delete(user);
        auditLogService.log(user.getUsername(), "DELETE_USER", "Kullanıcı silindi: id=" + id);
    }

    @Override
    public UserResponse updatePassword(String username, UpdatePasswordRequest request) {
        log.info("[USER SERVICE] Kullanıcı şifre güncelleniyor - username: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            log.warn("[USER SERVICE] Eski şifre yanlış - username: {}", username);
            throw new InvalidPasswordException("Eski şifre yanlış");
        }

        boolean sameRaw = request.oldPassword().equals(request.newPassword());
        boolean sameEncoded = passwordEncoder.matches(request.newPassword(), user.getPassword());
        if (sameRaw || sameEncoded) {
            throw new BadRequestException("Yeni şifre eski şifre ile aynı olamaz");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        auditLogService.log(username, "UPDATE_PASSWORD", "Kullanıcı şifresini güncelledi.");
        log.info("[USER SERVICE] Şifre güncellendi - username: {}", username);
        return UserMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUserProfile(String username, UpdateProfileRequest request) {
        log.info("[USER SERVICE] Kullanıcı profili güncelleniyor - username: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        String[] names = request.fullName().split(" ", 2);
        if (names.length == 2) {
            user.getEmployee().setFirstName(names[0]);
            user.getEmployee().setLastName(names[1]);
        } else {
            user.getEmployee().setFirstName(request.fullName());
            user.getEmployee().setLastName("");
        }
        user.getEmployee().setPosition(request.position());

        User updatedUser = userRepository.save(user);
        auditLogService.log(username, "UPDATE_PROFILE", "Kullanıcı profilini güncelledi.");
        log.info("[USER SERVICE] Kullanıcı profili güncellendi - username: {}", username);
        return UserMapper.toUserResponse(updatedUser);
    }

    @Override
    public UserResponse getUserById(Long id) {
        log.info("[USER SERVICE] Kullanıcı getiriliyor - id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        return UserMapper.toUserResponse(user);
    }

    private void ensureDefaultEmployeeRole(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(new HashSet<>(Set.of(Role.ROLE_EMPLOYEE)));
            log.debug("[USER SERVICE] Rol listesi boştu; ROLE_EMPLOYEE atandı - userId: {}", user.getId());
        }
    }
}
