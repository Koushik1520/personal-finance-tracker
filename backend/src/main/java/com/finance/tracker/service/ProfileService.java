package com.finance.tracker.service;

import com.finance.tracker.dto.ProfileUpdateRequest;
import com.finance.tracker.dto.ProfileResponse;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {
    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public ProfileResponse getProfile() {
        User user = getCurrentUser();
        return new ProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getPhone(),
                user.getProfilePicture(), user.getPreferredCurrency(), user.getEmailNotifications(),
                user.getBudgetAlerts(), user.getTheme(), user.getRole());
    }

    public ProfileResponse updateProfile(ProfileUpdateRequest request) {
        User user = getCurrentUser();
        if (request.name() != null) user.setName(request.name());
        if (request.email() != null) user.setEmail(request.email());
        if (request.phone() != null) user.setPhone(request.phone());
        if (request.preferredCurrency() != null) user.setPreferredCurrency(request.preferredCurrency());
        if (request.emailNotifications() != null) user.setEmailNotifications(request.emailNotifications());
        if (request.budgetAlerts() != null) user.setBudgetAlerts(request.budgetAlerts());
        if (request.theme() != null) user.setTheme(request.theme());
        User saved = userRepository.save(user);
        return new ProfileResponse(saved.getId(), saved.getName(), saved.getEmail(), saved.getPhone(),
                saved.getProfilePicture(), saved.getPreferredCurrency(), saved.getEmailNotifications(),
                saved.getBudgetAlerts(), saved.getTheme(), saved.getRole());
    }
}
