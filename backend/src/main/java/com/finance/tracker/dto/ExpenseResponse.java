package com.finance.tracker.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private String title;
    private BigDecimal amount;
    private String category;
    private String paymentMethod;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private String description;
    private String receipt;
}
