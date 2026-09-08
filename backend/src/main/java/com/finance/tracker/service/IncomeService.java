package com.finance.tracker.service;

import com.finance.tracker.dto.IncomeRequest;
import com.finance.tracker.dto.IncomeResponse;
import com.finance.tracker.entity.Income;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.IncomeRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class IncomeService {
    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public List<IncomeResponse> getAllIncomes(LocalDate startDate, LocalDate endDate, String search) {
        User user = getCurrentUser();
        List<Income> incomes = incomeRepository.findByUserId(user.getId());
        if (startDate != null) {
            incomes = incomes.stream().filter(i -> !i.getDate().isBefore(startDate)).toList();
        }
        if (endDate != null) {
            incomes = incomes.stream().filter(i -> !i.getDate().isAfter(endDate)).toList();
        }
        if (search != null && !search.isEmpty()) {
            incomes = incomes.stream().filter(i -> i.getTitle().toLowerCase().contains(search.toLowerCase())).toList();
        }
        return incomes.stream().map(i -> new IncomeResponse(i.getId(), i.getTitle(), i.getAmount(), i.getSource(),
                i.getDescription(), i.getDate())).collect(java.util.stream.Collectors.toList());
    }

    public Optional<IncomeResponse> getIncomeById(Long id) {
        User user = getCurrentUser();
        return incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .map(i -> new IncomeResponse(i.getId(), i.getTitle(), i.getAmount(), i.getSource(),
                        i.getDescription(), i.getDate()));
    }

    public IncomeResponse createIncome(IncomeRequest request) {
        User user = getCurrentUser();
        Income income = new Income();
        income.setTitle(request.title());
        income.setAmount(request.amount());
        income.setSource(request.source());
        income.setDescription(request.description());
        income.setDate(request.date());
        income.setUser(user);
        Income saved = incomeRepository.save(income);
        return new IncomeResponse(saved.getId(), saved.getTitle(), saved.getAmount(), saved.getSource(),
                saved.getDescription(), saved.getDate());
    }

    public Optional<IncomeResponse> updateIncome(Long id, IncomeRequest request) {
        User user = getCurrentUser();
        return incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .map(i -> {
                    i.setTitle(request.title());
                    i.setAmount(request.amount());
                    i.setSource(request.source());
                    i.setDescription(request.description());
                    i.setDate(request.date());
                    Income saved = incomeRepository.save(i);
                    return new IncomeResponse(saved.getId(), saved.getTitle(), saved.getAmount(), saved.getSource(),
                            saved.getDescription(), saved.getDate());
                });
    }

    public boolean deleteIncome(Long id) {
        User user = getCurrentUser();
        Optional<Income> income = incomeRepository.findById(id).filter(i -> i.getUser().getId().equals(user.getId()));
        income.ifPresent(incomeRepository::delete);
        return income.isPresent();
    }

    public BigDecimal getTotalIncomeForCurrentMonth() {
        User user = getCurrentUser();
        LocalDate now = LocalDate.now();
        LocalDate start = now.withDayOfMonth(1);
        return incomeRepository.sumAmountByUserIdAndDateBetween(user.getId(), start, now);
    }
}
