package com.finance.tracker.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class SavingsGoalResponse {
    private Long id;
    private String name;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private Double progressPercentage;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate deadline;
    private String description;
}
