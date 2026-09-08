package com.finance.tracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record BudgetRequest(
        @NotBlank(message = "Category is required")
        String category,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
        BigDecimal amount,

        @NotNull(message = "Month is required")
        Integer month,

        @NotNull(message = "Year is required")
        Integer year
) {}
