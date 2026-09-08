package com.finance.tracker.service;

import com.finance.tracker.entity.Budget;
import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.Notification;
import com.finance.tracker.entity.Report;
import com.finance.tracker.entity.SavingsGoal;
import com.finance.tracker.entity.User;
import com.finance.tracker.entity.Income;
import com.finance.tracker.repository.BudgetRepository;
import com.finance.tracker.repository.ExpenseRepository;
import com.finance.tracker.repository.IncomeRepository;
import com.finance.tracker.repository.NotificationRepository;
import com.finance.tracker.repository.ReportRepository;
import com.finance.tracker.repository.SavingsGoalRepository;
import com.finance.tracker.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Component
public class ScheduledTasks {
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final BudgetRepository budgetRepository;
    private final SavingsGoalRepository savingsGoalRepository;
    private final NotificationRepository notificationRepository;
    private final ReportRepository reportRepository;

    public ScheduledTasks(UserRepository userRepository, ExpenseRepository expenseRepository,
                          IncomeRepository incomeRepository, BudgetRepository budgetRepository,
                          SavingsGoalRepository savingsGoalRepository,
                          NotificationRepository notificationRepository, ReportRepository reportRepository) {
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.budgetRepository = budgetRepository;
        this.savingsGoalRepository = savingsGoalRepository;
        this.notificationRepository = notificationRepository;
        this.reportRepository = reportRepository;
    }

    @Scheduled(cron = "0 0 9 1 * *")
    public void generateMonthlyReports() {
        List<User> users = userRepository.findAll();
        LocalDate now = LocalDate.now();
        YearMonth ym = YearMonth.now().minusMonths(1);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        for (User user : users) {
            List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(user.getId(), start, end);
            List<Income> incomes = incomeRepository.findByUserIdAndDateBetween(user.getId(), start, end);
            BigDecimal totalIncome = incomes.stream()
                    .map(Income::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal totalExpenses = expenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Report report = new Report();
            report.setType("MONTHLY");
            report.setPeriod(ym.toString());
            report.setUser(user);
            reportRepository.save(report);

            Notification notification = new Notification();
            notification.setType("REPORT");
            notification.setTitle("Monthly Report Ready");
            notification.setMessage("Your monthly report for " + ym + " is ready. Total Income: " + totalIncome + ", Total Expenses: " + totalExpenses);
            notification.setUser(user);
            notificationRepository.save(notification);
        }
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void sendBudgetReminders() {
        List<User> users = userRepository.findAll();
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        for (User user : users) {
            List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(user.getId(), currentMonth, currentYear);
            for (Budget budget : budgets) {
                YearMonth ym = YearMonth.of(budget.getYear(), budget.getMonth());
                LocalDate start = ym.atDay(1);
                LocalDate end = ym.atEndOfMonth();
                List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(user.getId(), start, end);
                BigDecimal spent = expenses.stream()
                        .filter(e -> e.getCategory().equals(budget.getCategory()))
                        .map(Expense::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                double utilization = spent.doubleValue() / budget.getAmount().doubleValue() * 100;

                if (utilization >= 90) {
                    Notification notification = new Notification();
                    notification.setType("BUDGET_WARNING");
                    notification.setTitle("Budget Exceeded");
                    notification.setMessage("You have used " + String.format("%.2f", utilization) + "% of your " + budget.getCategory() + " budget.");
                    notification.setUser(user);
                    notificationRepository.save(notification);
                } else if (utilization >= 75) {
                    Notification notification = new Notification();
                    notification.setType("BUDGET_ALERT");
                    notification.setTitle("Budget Alert");
                    notification.setMessage("You have used " + String.format("%.2f", utilization) + "% of your " + budget.getCategory() + " budget.");
                    notification.setUser(user);
                    notificationRepository.save(notification);
                }
            }
        }
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void sendSavingsReminders() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            List<SavingsGoal> goals = savingsGoalRepository.findByUser(user);
            for (SavingsGoal goal : goals) {
                double progress = goal.getCurrentAmount().doubleValue() / goal.getTargetAmount().doubleValue() * 100;
                if (progress >= 100) {
                    Notification notification = new Notification();
                    notification.setType("SAVINGS_MILESTONE");
                    notification.setTitle("Savings Goal Reached");
                    notification.setMessage("Congratulations! You have reached your savings goal: " + goal.getName());
                    notification.setUser(user);
                    notificationRepository.save(notification);
                } else if (progress >= 80) {
                    Notification notification = new Notification();
                    notification.setType("SAVINGS_ALERT");
                    notification.setTitle("Savings Goal Almost Reached");
                    notification.setMessage("You are " + String.format("%.2f", progress) + "% towards your savings goal: " + goal.getName());
                    notification.setUser(user);
                    notificationRepository.save(notification);
                }
            }
        }
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void sendUpcomingBillReminders() {
        List<User> users = userRepository.findAll();
        LocalDate now = LocalDate.now();
        LocalDate weekLater = now.plusDays(7);

        for (User user : users) {
            List<Expense> upcomingBills = expenseRepository.findByUserIdAndDateBetween(user.getId(), now, weekLater);
            for (Expense expense : upcomingBills) {
                Notification notification = new Notification();
                notification.setType("BILL_REMINDER");
                notification.setTitle("Upcoming Bill");
                notification.setMessage("You have an upcoming expense: " + expense.getTitle() + " on " + expense.getDate() + " amounting to " + expense.getAmount());
                notification.setUser(user);
                notificationRepository.save(notification);
            }
        }
    }
}
