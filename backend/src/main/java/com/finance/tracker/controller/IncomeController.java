package com.finance.tracker.controller;

import com.finance.tracker.dto.IncomeRequest;
import com.finance.tracker.dto.IncomeResponse;
import com.finance.tracker.service.IncomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {
    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping
    public ResponseEntity<List<IncomeResponse>> getAllIncomes(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String search) {
        java.time.LocalDate sd = startDate != null ? java.time.LocalDate.parse(startDate) : null;
        java.time.LocalDate ed = endDate != null ? java.time.LocalDate.parse(endDate) : null;
        return ResponseEntity.ok(incomeService.getAllIncomes(sd, ed, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<IncomeResponse>> getIncomeById(@PathVariable Long id) {
        return ResponseEntity.ok(incomeService.getIncomeById(id));
    }

    @PostMapping
    public ResponseEntity<IncomeResponse> createIncome(@RequestBody IncomeRequest request) {
        return ResponseEntity.ok(incomeService.createIncome(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Optional<IncomeResponse>> updateIncome(@PathVariable Long id, @RequestBody IncomeRequest request) {
        return ResponseEntity.ok(incomeService.updateIncome(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteIncome(@PathVariable Long id) {
        return ResponseEntity.ok(incomeService.deleteIncome(id));
    }
}
