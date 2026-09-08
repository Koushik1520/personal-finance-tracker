package com.finance.tracker.service;

import com.finance.tracker.dto.BudgetRequest;
import com.finance.tracker.dto.BudgetResponse;
import com.finance.tracker.entity.Budget;
import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.BudgetRepository;
import com.finance.tracker.repository.ExpenseRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    public BudgetService(BudgetRepository budgetRepository, ExpenseRepository expenseRepository) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public List<BudgetResponse> getAllBudgets() {
        User user = getCurrentUser();
        List<Budget> budgets = budgetRepository.findByUserId(user.getId());
        return budgets.stream().map(this::mapToResponse).collect(java.util.stream.Collectors.toList());
    }

    public Optional<BudgetResponse> getBudgetById(Long id) {
        User user = getCurrentUser();
        return budgetRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .map(this::mapToResponse);
    }

    public BudgetResponse createBudget(BudgetRequest request) {
        User user = getCurrentUser();
        if (budgetRepository.existsByUserAndCategoryAndMonthAndYear(user, request.category(), request.month(), request.year())) {
            throw new RuntimeException("Budget already exists for this category and period");
        }
        Budget budget = new Budget();
        budget.setCategory(request.category());
        budget.setAmount(request.amount());
        budget.setMonth(request.month());
        budget.setYear(request.year());
        budget.setUser(user);
        Budget saved = budgetRepository.save(budget);
        return mapToResponse(saved);
    }

    public Optional<BudgetResponse> updateBudget(Long id, BudgetRequest request) {
        User user = getCurrentUser();
        return budgetRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .map(b -> {
                    b.setCategory(request.category());
                    b.setAmount(request.amount());
                    b.setMonth(request.month());
                    b.setYear(request.year());
                    Budget saved = budgetRepository.save(b);
                    return mapToResponse(saved);
                });
    }

    public boolean deleteBudget(Long id) {
        User user = getCurrentUser();
        Optional<Budget> budget = budgetRepository.findById(id).filter(b -> b.getUser().getId().equals(user.getId()));
        budget.ifPresent(budgetRepository::delete);
        return budget.isPresent();
    }

    private BudgetResponse mapToResponse(Budget budget) {
        User user = getCurrentUser();
        YearMonth ym = YearMonth.of(budget.getYear(), budget.getMonth());
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(user.getId(), start, end);
        BigDecimal spent = expenses.stream()
                .filter(e -> e.getCategory().equals(budget.getCategory()))
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        double utilization = spent.doubleValue() / budget.getAmount().doubleValue() * 100;
        return new BudgetResponse(budget.getId(), budget.getCategory(), budget.getAmount(),
                budget.getMonth(), budget.getYear(), spent, Math.min(utilization, 100));
    }
}
