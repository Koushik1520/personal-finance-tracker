package com.finance.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class ReportResponse {
    private String period;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netSavings;
    private List<Map<String, Object>> categoryWiseSpending;
    private List<Map<String, Object>> dailyData;
    private Map<String, Object> budgetAnalysis;
    private List<Map<String, Object>> topExpenses;
}
