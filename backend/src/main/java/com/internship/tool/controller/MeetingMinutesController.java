package com.internship.tool.controller;

import com.internship.tool.entity.MeetingMinutes;
import com.internship.tool.service.MeetingMinutesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/minutes")
@RequiredArgsConstructor
public class MeetingMinutesController {

    private final MeetingMinutesService service;

    // GET /api/minutes?page=0&size=10
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<MeetingMinutes>> getAll(Pageable pageable) {
        return ResponseEntity.ok(service.getAll(pageable));
    }

    // GET /api/minutes/{id}
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<MeetingMinutes> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // POST /api/minutes
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<MeetingMinutes> create(@Valid @RequestBody MeetingMinutes meetingMinutes) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(meetingMinutes));
    }
}
