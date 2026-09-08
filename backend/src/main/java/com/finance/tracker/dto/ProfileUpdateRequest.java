package com.finance.tracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ProfileUpdateRequest(
        String name,
        @Email(message = "Email should be valid")
        String email,
        String phone,
        String preferredCurrency,
        Boolean emailNotifications,
        Boolean budgetAlerts,
        String theme
) {}
