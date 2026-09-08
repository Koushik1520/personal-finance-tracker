package com.finance.tracker.repository;

import com.finance.tracker.entity.Report;
import com.finance.tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUser(User user);
}
