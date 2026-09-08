package com.finance.tracker.service;

import com.finance.tracker.dto.ExpenseRequest;
import com.finance.tracker.dto.ExpenseResponse;
import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.ExpenseRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public List<ExpenseResponse> getAllExpenses(String category, String paymentMethod, String search, LocalDate startDate, LocalDate endDate) {
        User user = getCurrentUser();
        List<Expense> expenses = expenseRepository.findByUserId(user.getId());
        if (category != null && !category.isEmpty()) {
            expenses = expenses.stream().filter(e -> e.getCategory().equals(category)).toList();
        }
        if (paymentMethod != null && !paymentMethod.isEmpty()) {
            expenses = expenses.stream().filter(e -> e.getPaymentMethod().equals(paymentMethod)).toList();
        }
        if (search != null && !search.isEmpty()) {
            expenses = expenses.stream().filter(e -> e.getTitle().toLowerCase().contains(search.toLowerCase())).toList();
        }
        if (startDate != null) {
            expenses = expenses.stream().filter(e -> !e.getDate().isBefore(startDate)).toList();
        }
        if (endDate != null) {
            expenses = expenses.stream().filter(e -> !e.getDate().isAfter(endDate)).toList();
        }
        return expenses.stream().map(e -> new ExpenseResponse(
                e.getId(), e.getTitle(), e.getAmount(), e.getCategory(), e.getPaymentMethod(),
                e.getDate(), e.getDescription(), e.getReceipt()
        )).collect(Collectors.toList());
    }

    public Optional<ExpenseResponse> getExpenseById(Long id) {
        User user = getCurrentUser();
        return expenseRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()))
                .map(e -> new ExpenseResponse(e.getId(), e.getTitle(), e.getAmount(), e.getCategory(),
                        e.getPaymentMethod(), e.getDate(), e.getDescription(), e.getReceipt()));
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {
        User user = getCurrentUser();
        Expense expense = new Expense();
        expense.setTitle(request.title());
        expense.setAmount(request.amount());
        expense.setCategory(request.category());
        expense.setPaymentMethod(request.paymentMethod());
        expense.setDate(request.date());
        expense.setDescription(request.description());
        expense.setUser(user);
        Expense saved = expenseRepository.save(expense);
        return new ExpenseResponse(saved.getId(), saved.getTitle(), saved.getAmount(), saved.getCategory(),
                saved.getPaymentMethod(), saved.getDate(), saved.getDescription(), saved.getReceipt());
    }

    public Optional<ExpenseResponse> updateExpense(Long id, ExpenseRequest request) {
        User user = getCurrentUser();
        return expenseRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()))
                .map(e -> {
                    e.setTitle(request.title());
                    e.setAmount(request.amount());
                    e.setCategory(request.category());
                    e.setPaymentMethod(request.paymentMethod());
                    e.setDate(request.date());
                    e.setDescription(request.description());
                    Expense saved = expenseRepository.save(e);
                    return new ExpenseResponse(saved.getId(), saved.getTitle(), saved.getAmount(), saved.getCategory(),
                            saved.getPaymentMethod(), saved.getDate(), saved.getDescription(), saved.getReceipt());
                });
    }

    public boolean deleteExpense(Long id) {
        User user = getCurrentUser();
        Optional<Expense> expense = expenseRepository.findById(id).filter(e -> e.getUser().getId().equals(user.getId()));
        expense.ifPresent(expenseRepository::delete);
        return expense.isPresent();
    }

    public BigDecimal getTotalExpensesForCurrentMonth() {
        User user = getCurrentUser();
        LocalDate now = LocalDate.now();
        LocalDate start = now.withDayOfMonth(1);
        LocalDate end = now;
        return expenseRepository.sumAmountByUserIdAndDateBetween(user.getId(), start, end);
    }
}
