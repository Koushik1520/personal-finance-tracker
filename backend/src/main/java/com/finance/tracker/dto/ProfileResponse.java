package com.finance.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String profilePicture;
    private String preferredCurrency;
    private Boolean emailNotifications;
    private Boolean budgetAlerts;
    private String theme;
    private String role;
}
