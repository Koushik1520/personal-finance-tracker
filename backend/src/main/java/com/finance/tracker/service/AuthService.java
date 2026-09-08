package com.finance.tracker.service;

import com.finance.tracker.dto.AuthResponse;
import com.finance.tracker.dto.ForgotPasswordRequest;
import com.finance.tracker.dto.LoginRequest;
import com.finance.tracker.dto.RegisterRequest;
import com.finance.tracker.dto.ResetPasswordRequest;
import com.finance.tracker.entity.PasswordResetToken;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.PasswordResetTokenRepository;
import com.finance.tracker.repository.UserRepository;
import com.finance.tracker.security.JwtUtil;
import com.finance.tracker.util.EmailUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailUtil emailUtil;
    private final java.util.Set<String> tokenBlacklist = java.util.Collections.synchronizedSet(new java.util.HashSet<>());

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
                       PasswordResetTokenRepository passwordResetTokenRepository, EmailUtil emailUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailUtil = emailUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }
        if (!request.password().equals(request.confirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        return new AuthResponse(token, refreshToken, user.getName(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtUtil.generateToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        return new AuthResponse(token, refreshToken, user.getName(), user.getEmail(), user.getRole());
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (refreshToken == null || tokenBlacklist.contains(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }
        String username = jwtUtil.extractUsername(refreshToken);
        if (username == null || jwtUtil.isTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh token expired");
        }
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String newAccessToken = jwtUtil.generateToken(user.getEmail());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        return new AuthResponse(newAccessToken, newRefreshToken, user.getName(), user.getEmail(), user.getRole());
    }

    public String logout(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            tokenBlacklist.add(token.substring(7));
        }
        return "Logged out successfully";
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found with this email"));
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        passwordResetTokenRepository.save(resetToken);
        Map<String, Object> model = new HashMap<>();
        model.put("name", user.getName());
        model.put("resetLink", "http://localhost:3000/reset-password?token=" + token);
        emailUtil.sendEmail(user.getEmail(), "Reset Your Password", "reset-password", model);
        return "Password reset link sent to your email";
    }

    public String resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }
        if (resetToken.getUsed()) {
            throw new RuntimeException("Token already used");
        }
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
        return "Password reset successfully";
    }
}
