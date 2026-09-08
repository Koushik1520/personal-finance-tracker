package com.finance.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class BudgetResponse {
    private Long id;
    private String category;
    private BigDecimal amount;
    private Integer month;
    private Integer year;
    private BigDecimal spent;
    private Double utilizationPercentage;
}
