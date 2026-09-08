package com.finance.tracker.repository;

import com.finance.tracker.entity.Budget;
import com.finance.tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserId(Long userId);
    List<Budget> findByUserIdAndMonthAndYear(Long userId, Integer month, Integer year);
    Optional<Budget> findByUserIdAndCategoryAndMonthAndYear(Long userId, String category, Integer month, Integer year);
    boolean existsByUserAndCategoryAndMonthAndYear(User user, String category, Integer month, Integer year);
}
