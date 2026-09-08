package com.finance.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
@AllArgsConstructor
public class DashboardSummary {
    private BigDecimal totalBalance;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal monthlyBudgetRemaining;
    private BigDecimal savingsProgress;
    private Long upcomingBills;
    private Long recentTransactions;
    private java.util.List<Map<String, Object>> monthlyData;
    private java.util.List<Map<String, Object>> categoryData;
    private java.util.List<Map<String, Object>> weeklyData;
}
