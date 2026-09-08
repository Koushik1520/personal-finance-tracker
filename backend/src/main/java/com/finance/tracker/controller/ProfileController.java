package com.finance.tracker.controller;

import com.finance.tracker.dto.ProfileResponse;
import com.finance.tracker.dto.ProfileUpdateRequest;
import com.finance.tracker.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile() {
        return ResponseEntity.ok(profileService.getProfile());
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(@RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(request));
    }
}
