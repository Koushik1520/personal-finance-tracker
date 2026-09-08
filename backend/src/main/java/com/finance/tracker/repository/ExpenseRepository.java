package com.finance.tracker.repository;

import com.finance.tracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserId(Long userId);
    List<Expense> findByUserIdAndCategory(Long userId, String category);
    List<Expense> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.date BETWEEN :start AND :end")
    BigDecimal sumAmountByUserIdAndDateBetween(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);
}
