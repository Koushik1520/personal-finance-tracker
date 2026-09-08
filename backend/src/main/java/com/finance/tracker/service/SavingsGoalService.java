package com.finance.tracker.service;

import com.finance.tracker.dto.SavingsGoalRequest;
import com.finance.tracker.dto.SavingsGoalResponse;
import com.finance.tracker.entity.SavingsGoal;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.SavingsGoalRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SavingsGoalService {
    private final SavingsGoalRepository savingsGoalRepository;

    public SavingsGoalService(SavingsGoalRepository savingsGoalRepository) {
        this.savingsGoalRepository = savingsGoalRepository;
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public List<SavingsGoalResponse> getAllSavingsGoals() {
        User user = getCurrentUser();
        List<SavingsGoal> goals = savingsGoalRepository.findByUser(user);
        return goals.stream().map(this::mapToResponse).collect(java.util.stream.Collectors.toList());
    }

    public Optional<SavingsGoalResponse> getSavingsGoalById(Long id) {
        User user = getCurrentUser();
        return savingsGoalRepository.findById(id)
                .filter(g -> g.getUser().getId().equals(user.getId()))
                .map(this::mapToResponse);
    }

    public SavingsGoalResponse createSavingsGoal(SavingsGoalRequest request) {
        User user = getCurrentUser();
        SavingsGoal goal = new SavingsGoal();
        goal.setName(request.name());
        goal.setTargetAmount(request.targetAmount());
        goal.setCurrentAmount(BigDecimal.ZERO);
        goal.setDeadline(request.deadline());
        goal.setDescription(request.description());
        goal.setUser(user);
        SavingsGoal saved = savingsGoalRepository.save(goal);
        return mapToResponse(saved);
    }

    public Optional<SavingsGoalResponse> updateSavingsGoal(Long id, SavingsGoalRequest request) {
        User user = getCurrentUser();
        return savingsGoalRepository.findById(id)
                .filter(g -> g.getUser().getId().equals(user.getId()))
                .map(g -> {
                    g.setName(request.name());
                    g.setTargetAmount(request.targetAmount());
                    g.setDeadline(request.deadline());
                    g.setDescription(request.description());
                    SavingsGoal saved = savingsGoalRepository.save(g);
                    return mapToResponse(saved);
                });
    }

    public boolean deleteSavingsGoal(Long id) {
        User user = getCurrentUser();
        Optional<SavingsGoal> goal = savingsGoalRepository.findById(id).filter(g -> g.getUser().getId().equals(user.getId()));
        goal.ifPresent(savingsGoalRepository::delete);
        return goal.isPresent();
    }

    public SavingsGoalResponse updateSavings(Long id, BigDecimal amount) {
        User user = getCurrentUser();
        SavingsGoal goal = savingsGoalRepository.findById(id)
                .filter(g -> g.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Savings goal not found"));
        goal.setCurrentAmount(goal.getCurrentAmount().add(amount));
        SavingsGoal saved = savingsGoalRepository.save(goal);
        return mapToResponse(saved);
    }

    private SavingsGoalResponse mapToResponse(SavingsGoal goal) {
        double progress = goal.getCurrentAmount().doubleValue() / goal.getTargetAmount().doubleValue() * 100;
        return new SavingsGoalResponse(goal.getId(), goal.getName(), goal.getTargetAmount(),
                goal.getCurrentAmount(), Math.min(progress, 100), goal.getDeadline(), goal.getDescription());
    }
}
