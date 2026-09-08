package com.finance.tracker.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@Component
public class EmailUtil {
    private final JavaMailSender mailSender;

    @Autowired
    public EmailUtil(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String template, Map<String, Object> model) {
        try {
            var mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(to);
            helper.setSubject(subject);
            String htmlContent = buildHtml(template, model);
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    private String buildHtml(String template, Map<String, Object> model) {
        StringBuilder html = new StringBuilder("<html><body>");
        html.append("<h2>Hello ").append(model.get("name")).append("!</h2>");
        if ("reset-password".equals(template)) {
            html.append("<p>Click the link below to reset your password:</p>");
            html.append("<a href=\"").append(model.get("resetLink")).append("\" style=\"background:#2563eb;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;\">Reset Password</a>");
        }
        html.append("<p>This link will expire in 1 hour.</p>");
        html.append("</body></html>");
        return html.toString();
    }
}
