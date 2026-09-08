package com.finance.tracker.controller;

import com.finance.tracker.dto.BudgetRequest;
import com.finance.tracker.dto.BudgetResponse;
import com.finance.tracker.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getAllBudgets() {
        return ResponseEntity.ok(budgetService.getAllBudgets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<BudgetResponse>> getBudgetById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(@RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.createBudget(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Optional<BudgetResponse>> updateBudget(@PathVariable Long id, @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.updateBudget(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteBudget(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.deleteBudget(id));
    }
}
