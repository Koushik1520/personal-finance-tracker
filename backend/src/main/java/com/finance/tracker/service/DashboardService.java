package com.finance.tracker.service;

import com.finance.tracker.dto.DashboardSummary;
import com.finance.tracker.entity.Budget;
import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.BudgetRepository;
import com.finance.tracker.repository.ExpenseRepository;
import com.finance.tracker.repository.IncomeRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final BudgetRepository budgetRepository;

    public DashboardService(ExpenseRepository expenseRepository, IncomeRepository incomeRepository,
                            BudgetRepository budgetRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.budgetRepository = budgetRepository;
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public DashboardSummary getSummary() {
        User user = getCurrentUser();
        LocalDate now = LocalDate.now();
        List<Expense> allExpenses = expenseRepository.findByUserId(user.getId());
        List<com.finance.tracker.entity.Income> allIncomes = incomeRepository.findByUserId(user.getId());
        BigDecimal totalIncome = allIncomes.stream()
                .map(com.finance.tracker.entity.Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpenses = allExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalBalance = totalIncome.subtract(totalExpenses);
        LocalDate start = now.withDayOfMonth(1);
        BigDecimal monthlyExpenses = expenseRepository.sumAmountByUserIdAndDateBetween(user.getId(), start, now);
        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(user.getId(), now.getMonthValue(), now.getYear());
        BigDecimal totalBudget = budgets.stream().map(Budget::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal monthlyBudgetRemaining = totalBudget.subtract(monthlyExpenses);
        BigDecimal savingsTarget = totalBudget.subtract(monthlyExpenses);
        if (savingsTarget.compareTo(BigDecimal.ZERO) < 0) savingsTarget = BigDecimal.ZERO;
        BigDecimal savingsProgress = totalIncome.compareTo(BigDecimal.ZERO) > 0
                ? savingsTarget.divide(totalIncome, 4, java.math.RoundingMode.HALF_UP).multiply(new BigDecimal(100))
                : BigDecimal.ZERO;
        List<Expense> upcomingBills = allExpenses.stream()
                .filter(e -> !e.getDate().isBefore(now) && e.getDate().isBefore(now.plusDays(7)))
                .toList();
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        for (int i = 0; i < 6; i++) {
            YearMonth ym = YearMonth.now().minusMonths(i);
            LocalDate monthStart = ym.atDay(1);
            LocalDate monthEnd = ym.atEndOfMonth();
            BigDecimal monthIncome = allIncomes.stream()
                    .filter(inc -> !inc.getDate().isBefore(monthStart) && !inc.getDate().isAfter(monthEnd))
                    .map(com.finance.tracker.entity.Income::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal monthExpense = allExpenses.stream()
                    .filter(e -> !e.getDate().isBefore(monthStart) && !e.getDate().isAfter(monthEnd))
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            Map<String, Object> data = new HashMap<>();
            data.put("month", ym.getMonth().toString());
            data.put("income", monthIncome);
            data.put("expenses", monthExpense);
            monthlyData.add(data);
        }
        Map<String, BigDecimal> categoryMap = allExpenses.stream()
                .collect(Collectors.groupingBy(Expense::getCategory,
                        Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
        List<Map<String, Object>> categoryData = categoryMap.entrySet().stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("category", e.getKey());
                    map.put("amount", e.getValue());
                    return map;
                }).collect(Collectors.toList());
        List<Map<String, Object>> weeklyData = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = now.minusDays(i);
            BigDecimal dayExpense = allExpenses.stream()
                    .filter(e -> e.getDate().equals(day))
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            Map<String, Object> data = new HashMap<>();
            data.put("day", day.getDayOfWeek().toString());
            data.put("amount", dayExpense);
            weeklyData.add(data);
        }
        return new DashboardSummary(totalBalance, totalIncome, totalExpenses, monthlyBudgetRemaining,
                savingsProgress, (long) upcomingBills.size(), (long) allExpenses.size(),
                monthlyData, categoryData, weeklyData);
    }
}
