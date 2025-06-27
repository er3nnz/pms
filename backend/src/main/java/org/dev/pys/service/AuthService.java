package org.dev.pys.service;

import org.dev.pys.dto.request.LoginRequest;
import org.dev.pys.dto.request.RegisterRequest;
import org.dev.pys.dto.response.LoginResponse;
import org.dev.pys.dto.response.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    void logout();
}
