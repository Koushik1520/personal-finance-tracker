package com.finance.tracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SavingsGoalRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotNull(message = "Target amount is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Target amount must be greater than 0")
        BigDecimal targetAmount,

        @NotNull(message = "Deadline is required")
        LocalDate deadline,

        String description
) {}
