package com.finance.tracker.controller;

import com.finance.tracker.dto.SavingsGoalRequest;
import com.finance.tracker.dto.SavingsGoalResponse;
import com.finance.tracker.service.SavingsGoalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/savings-goals")
public class SavingsGoalController {
    private final SavingsGoalService savingsGoalService;

    public SavingsGoalController(SavingsGoalService savingsGoalService) {
        this.savingsGoalService = savingsGoalService;
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoalResponse>> getAllSavingsGoals() {
        return ResponseEntity.ok(savingsGoalService.getAllSavingsGoals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<SavingsGoalResponse>> getSavingsGoalById(@PathVariable Long id) {
        return ResponseEntity.ok(savingsGoalService.getSavingsGoalById(id));
    }

    @PostMapping
    public ResponseEntity<SavingsGoalResponse> createSavingsGoal(@RequestBody SavingsGoalRequest request) {
        return ResponseEntity.ok(savingsGoalService.createSavingsGoal(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Optional<SavingsGoalResponse>> updateSavingsGoal(@PathVariable Long id, @RequestBody SavingsGoalRequest request) {
        return ResponseEntity.ok(savingsGoalService.updateSavingsGoal(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteSavingsGoal(@PathVariable Long id) {
        return ResponseEntity.ok(savingsGoalService.deleteSavingsGoal(id));
    }

    @PostMapping("/{id}/deposit")
    public ResponseEntity<SavingsGoalResponse> deposit(@PathVariable Long id, @RequestParam BigDecimal amount) {
        return ResponseEntity.ok(savingsGoalService.updateSavings(id, amount));
    }
}
