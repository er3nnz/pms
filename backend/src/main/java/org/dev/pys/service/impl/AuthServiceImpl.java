package org.dev.pys.service.impl;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.dev.pys.dto.mapper.AuthMapper;
import org.dev.pys.dto.request.LoginRequest;
import org.dev.pys.dto.request.RegisterRequest;
import org.dev.pys.dto.response.LoginResponse;
import org.dev.pys.dto.response.RegisterResponse;
import org.dev.pys.entity.BlacklistToken;
import org.dev.pys.entity.User;
import org.dev.pys.enumarate.Role;
import org.dev.pys.exception.AuthExceptions.InvalidCredentialsException;
import org.dev.pys.exception.AuthExceptions.UnauthorizedException;
import org.dev.pys.exception.CommonExceptions.BadRequestException;
import org.dev.pys.exception.CommonExceptions.ResourceNotFoundException;
import org.dev.pys.repository.BlacklistTokenRepository;
import org.dev.pys.repository.UserRepository;
import org.dev.pys.security.JwtService;
import org.dev.pys.service.AuthService;
import org.dev.pys.service.AuditLogService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BlacklistTokenRepository blacklistTokenRepository;
    private final BCryptPasswordEncoder encoder;
    private final AuditLogService auditLogService;

    public AuthServiceImpl(UserRepository userRepository,
                           JwtService jwtService,
                           BlacklistTokenRepository blacklistTokenRepository,
                           BCryptPasswordEncoder encoder,
                           AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.blacklistTokenRepository = blacklistTokenRepository;
        this.encoder = encoder;
        this.auditLogService = auditLogService;
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {
        log.info("[REGISTER] Kayıt talebi alındı - username: {}", request.username());
        if (userRepository.existsByUsername(request.username())) {
            log.warn("[REGISTER] Kullanıcı adı zaten mevcut: {}", request.username());
            throw new BadRequestException("Kullanıcı adı zaten mevcut!");
        }

        if (userRepository.existsByEmployeeEmail(request.email())) {
            log.warn("[REGISTER] E-posta zaten mevcut: {}", request.email());
            throw new BadRequestException("E-posta zaten mevcut!");
        }

        User user = AuthMapper.toUser(request);
        user.setPassword(encoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        auditLogService.log(savedUser.getUsername(), "REGISTER", "Kullanıcı kaydı oluşturuldu.");
        log.info("[REGISTER] Kayıt başarıyla tamamlandı - id: {}, username: {}", savedUser.getId(),
                savedUser.getUsername());
        return AuthMapper.toRegisterResponse(savedUser);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("[LOGIN] Giriş denemesi - username/email: {}", request.credential());

        User user = userRepository.findByUsernameOrEmployeeEmail(request.credential(), request.credential())
                .orElseThrow(() -> {
                    log.warn("[LOGIN] Kullanıcı bulunamadı - input: {}", request.credential());
                    return new ResourceNotFoundException("Kullanıcı bulunamadı");
                });

        if (!encoder.matches(request.password(), user.getPassword())) {
            log.warn("[LOGIN] Hatalı şifre - input: {}", request.credential());
            throw new InvalidCredentialsException();
        }

        Role role = user.getRoles().stream().findFirst().orElse(Role.ROLE_EMPLOYEE);
        String token = jwtService.generateToken(user.getUsername(), role);
        auditLogService.log(user.getUsername(), "LOGIN", "Kullanıcı giriş yaptı.");
        log.info("[LOGIN] Giriş başarılı - kullanıcı: {}", user.getUsername());

        return AuthMapper.toLoginResponse(user, token);
    }


    @Override
    public void logout() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            log.warn("[LOGOUT] Oturum bulunamadı");
            throw new UnauthorizedException("Oturum bulunamadı");
        }

        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            throw new UnauthorizedException("Request context yok");
        }

        String header = attrs.getRequest().getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new UnauthorizedException("Geçersiz token formatı");
        }

        String token = header.substring(7);

        jwtService.validateToken(token);

        if (!blacklistTokenRepository.existsByToken(token)) {
            blacklistTokenRepository.save(
                    BlacklistToken.builder()
                            .token(token)
                            .expiryDate(jwtService.extractExpiration(token))
                            .build());
        }

        auditLogService.log(auth.getName(), "LOGOUT", "Kullanıcı çıkış yaptı.");
        SecurityContextHolder.clearContext();
        log.info("[LOGOUT] Çıkış işlemi tamamlandı");
    }

}