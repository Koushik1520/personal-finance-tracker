package com.finance.tracker.service;

import com.finance.tracker.dto.BudgetResponse;
import com.finance.tracker.dto.ExpenseRequest;
import com.finance.tracker.dto.ExpenseResponse;
import com.finance.tracker.dto.IncomeRequest;
import com.finance.tracker.dto.IncomeResponse;
import com.finance.tracker.dto.ReportResponse;
import com.finance.tracker.entity.Budget;
import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.Income;
import com.finance.tracker.entity.Report;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.BudgetRepository;
import com.finance.tracker.repository.ExpenseRepository;
import com.finance.tracker.repository.IncomeRepository;
import com.finance.tracker.repository.ReportRepository;
import com.finance.tracker.util.ReportExportUtil;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final BudgetRepository budgetRepository;
    private final ReportRepository reportRepository;
    private final ReportExportUtil reportExportUtil;

    public ReportService(ExpenseRepository expenseRepository, IncomeRepository incomeRepository,
                         BudgetRepository budgetRepository, ReportRepository reportRepository,
                         ReportExportUtil reportExportUtil) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.budgetRepository = budgetRepository;
        this.reportRepository = reportRepository;
        this.reportExportUtil = reportExportUtil;
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public ReportResponse generateReport(String period) {
        User user = getCurrentUser();
        LocalDate now = LocalDate.now();
        LocalDate start;
        LocalDate end;
        switch (period.toLowerCase()) {
            case "weekly":
                start = now.minusWeeks(1);
                end = now;
                break;
            case "yearly":
                start = now.minusYears(1);
                end = now;
                break;
            case "daily":
            case "monthly":
            default:
                start = now.withDayOfMonth(1);
                end = now;
                break;
        }
        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(user.getId(), start, end);
        List<Income> incomes = incomeRepository.findByUserIdAndDateBetween(user.getId(), start, end);
        BigDecimal totalIncome = incomes.stream().map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpenses = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal netSavings = totalIncome.subtract(totalExpenses);
        Map<String, BigDecimal> categoryMap = expenses.stream()
                .collect(Collectors.groupingBy(Expense::getCategory,
                        Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
        List<Map<String, Object>> categoryWise = categoryMap.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("category", e.getKey());
                    map.put("amount", e.getValue());
                    return map;
                }).collect(Collectors.toList());
        List<Map<String, Object>> dailyData = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            LocalDate d = start.plusDays(i);
            if (d.isAfter(end)) break;
            LocalDate finalD = d;
            BigDecimal dayExpense = expenses.stream()
                    .filter(e -> e.getDate().equals(finalD))
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            Map<String, Object> map = new HashMap<>();
            map.put("date", d.toString());
            map.put("amount", dayExpense);
            dailyData.add(map);
        }
        Map<String, Object> budgetAnalysis = new HashMap<>();
        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(user.getId(), now.getMonthValue(), now.getYear());
        for (Budget budget : budgets) {
            BigDecimal spent = expenses.stream()
                    .filter(e -> e.getCategory().equals(budget.getCategory()))
                    .filter(e -> {
                        YearMonth ym = YearMonth.of(e.getDate().getYear(), e.getDate().getMonthValue());
                        return ym.equals(YearMonth.of(budget.getYear(), budget.getMonth()));
                    })
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            double utilization = spent.doubleValue() / budget.getAmount().doubleValue() * 100;
            Map<String, Object> b = new HashMap<>();
            b.put("category", budget.getCategory());
            b.put("budget", budget.getAmount());
            b.put("spent", spent);
            b.put("utilization", Math.min(utilization, 100));
            budgetAnalysis.put(budget.getCategory(), b);
        }
        List<Map<String, Object>> topExpenses = expenses.stream()
                .sorted(Comparator.comparing(Expense::getAmount).reversed())
                .limit(10)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("title", e.getTitle());
                    map.put("amount", e.getAmount());
                    map.put("category", e.getCategory());
                    map.put("date", e.getDate().toString());
                    return map;
                }).collect(Collectors.toList());

        Report report = new Report();
        report.setType(period.toUpperCase());
        report.setPeriod(period);
        report.setUser(user);
        reportRepository.save(report);

        return new ReportResponse(period, totalIncome, totalExpenses, netSavings, categoryWise, dailyData, budgetAnalysis, topExpenses);
    }

    public byte[] exportPdf(String period) throws Exception {
        ReportResponse report = generateReport(period);
        return reportExportUtil.exportToPdf(report);
    }

    public String exportCsv(String period) {
        ReportResponse report = generateReport(period);
        return reportExportUtil.exportToCsv(report);
    }
}
