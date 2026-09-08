package com.finance.tracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(
        @NotBlank(message = "Title is required")
        String title,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
        BigDecimal amount,

        @NotBlank(message = "Category is required")
        String category,

        @NotBlank(message = "Payment method is required")
        String paymentMethod,

        @NotNull(message = "Date is required")
        LocalDate date,

        String description
) {}
