package com.finance.tracker.controller;

import com.finance.tracker.dto.AuthResponse;
import com.finance.tracker.dto.ForgotPasswordRequest;
import com.finance.tracker.dto.LoginRequest;
import com.finance.tracker.dto.RegisterRequest;
import com.finance.tracker.dto.ResetPasswordRequest;
import com.finance.tracker.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String refreshToken = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        return ResponseEntity.ok(authService.logout(authHeader));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }
}
