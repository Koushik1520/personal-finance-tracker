package com.finance.tracker.repository;

import com.finance.tracker.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserId(Long userId);
    List<Income> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId AND i.date BETWEEN :start AND :end")
    BigDecimal sumAmountByUserIdAndDateBetween(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);
}
