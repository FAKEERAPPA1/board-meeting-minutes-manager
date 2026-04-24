package com.internship.tool.controller;

import com.internship.tool.entity.MeetingMinutes;
import com.internship.tool.service.MeetingMinutesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/minutes")
@RequiredArgsConstructor
public class MeetingMinutesController {

    private final MeetingMinutesService service;

    // GET /api/minutes?page=0&size=10
    @GetMapping
    public ResponseEntity<Page<MeetingMinutes>> getAll(Pageable pageable) {
        return ResponseEntity.ok(service.getAll(pageable));
    }

    // GET /api/minutes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<MeetingMinutes> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id)); // throws 404 if not found
    }

    // POST /api/minutes
    @PostMapping
    public ResponseEntity<MeetingMinutes> create(@Valid @RequestBody MeetingMinutes meetingMinutes) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(meetingMinutes));
    }
}
