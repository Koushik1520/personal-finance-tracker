package com.finance.tracker.service;

import com.finance.tracker.dto.NotificationResponse;
import com.finance.tracker.entity.Notification;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.NotificationRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public List<NotificationResponse> getAllNotifications() {
        User user = getCurrentUser();
        return notificationRepository.findByUser(user).stream()
                .map(n -> new NotificationResponse(n.getId(), n.getType(), n.getTitle(), n.getMessage(), n.getIsRead(), n.getCreatedAt()))
                .toList();
    }

    public List<NotificationResponse> getUnreadNotifications() {
        User user = getCurrentUser();
        return notificationRepository.findByUserAndIsRead(user, false).stream()
                .map(n -> new NotificationResponse(n.getId(), n.getType(), n.getTitle(), n.getMessage(), n.getIsRead(), n.getCreatedAt()))
                .toList();
    }

    public NotificationResponse markAsRead(Long id) {
        User user = getCurrentUser();
        Notification notification = notificationRepository.findById(id)
                .filter(n -> n.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        Notification saved = notificationRepository.save(notification);
        return new NotificationResponse(saved.getId(), saved.getType(), saved.getTitle(), saved.getMessage(), saved.getIsRead(), saved.getCreatedAt());
    }

    public NotificationResponse createNotification(String type, String title, String message) {
        User user = getCurrentUser();
        Notification notification = new Notification();
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setUser(user);
        Notification saved = notificationRepository.save(notification);
        return new NotificationResponse(saved.getId(), saved.getType(), saved.getTitle(), saved.getMessage(), saved.getIsRead(), saved.getCreatedAt());
    }
}
