package com.finance.tracker.controller;

import com.finance.tracker.dto.ExpenseRequest;
import com.finance.tracker.dto.ExpenseResponse;
import com.finance.tracker.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        java.time.LocalDate sd = startDate != null ? java.time.LocalDate.parse(startDate) : null;
        java.time.LocalDate ed = endDate != null ? java.time.LocalDate.parse(endDate) : null;
        return ResponseEntity.ok(expenseService.getAllExpenses(category, paymentMethod, search, sd, ed));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<ExpenseResponse>> getExpenseById(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.createExpense(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Optional<ExpenseResponse>> updateExpense(@PathVariable Long id, @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteExpense(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.deleteExpense(id));
    }
}
