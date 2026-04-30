package com.internship.tool.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.tool.entity.BoardMeetingMinutes;
import com.internship.tool.service.MeetingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class MeetingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MeetingService meetingService;

    // Helper to build a dummy meeting
    private BoardMeetingMinutes dummyMeeting() {
        BoardMeetingMinutes m = new BoardMeetingMinutes();
        m.setId(1L);
        m.setTitle("Q1 Board Meeting");
        m.setMeetingDate(LocalDate.of(2026, 4, 14));
        m.setMinutesText("Discussed Q1 results.");
        m.setStatus("DRAFT");
        m.setCreatedBy("admin");
        m.setDeleted(false);
        return m;
    }

    // ─── GET /api/meetings ───────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "USER")
    void getAllMeetings_returns200() throws Exception {
        when(meetingService.getAllMeetings(any(PageRequest.class)))
            .thenReturn(new PageImpl<>(List.of(dummyMeeting())));

        mockMvc.perform(get("/api/meetings?page=0&size=10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray())
            .andExpect(jsonPath("$.content[0].title").value("Q1 Board Meeting"));
    }

    @Test
    void getAllMeetings_withoutToken_returns401() throws Exception {
        mockMvc.perform(get("/api/meetings"))
            .andExpect(status().isUnauthorized());
    }

    // ─── GET /api/meetings/{id} ──────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "USER")
    void getMeetingById_returns200() throws Exception {
        when(meetingService.getMeetingById(1L))
            .thenReturn(Optional.of(dummyMeeting()));

        mockMvc.perform(get("/api/meetings/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.title").value("Q1 Board Meeting"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getMeetingById_notFound_returns404() throws Exception {
        when(meetingService.getMeetingById(99L))
            .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/meetings/99"))
            .andExpect(status().isNotFound());
    }

    // ─── POST /api/meetings ──────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void createMeeting_returns201() throws Exception {
        BoardMeetingMinutes input = dummyMeeting();
        input.setId(null);

        when(meetingService.createMeeting(any(BoardMeetingMinutes.class)))
            .thenReturn(dummyMeeting());

        mockMvc.perform(post("/api/meetings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createMeeting_missingTitle_returns400() throws Exception {
        BoardMeetingMinutes input = dummyMeeting();
        input.setTitle(null); // invalid

        mockMvc.perform(post("/api/meetings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
            .andExpect(status().isBadRequest());
    }

    // ─── PUT /api/meetings/{id} ──────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateMeeting_returns200() throws Exception {
        BoardMeetingMinutes updated = dummyMeeting();
        updated.setTitle("Updated Title");

        when(meetingService.updateMeeting(eq(1L), any(BoardMeetingMinutes.class)))
            .thenReturn(updated);

        mockMvc.perform(put("/api/meetings/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateMeeting_notFound_returns404() throws Exception {
        when(meetingService.updateMeeting(eq(99L), any(BoardMeetingMinutes.class)))
            .thenThrow(new RuntimeException("Not found"));

        mockMvc.perform(put("/api/meetings/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dummyMeeting())))
            .andExpect(status().isNotFound());
    }

    // ─── DELETE /api/meetings/{id} ───────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteMeeting_returns204() throws Exception {
        when(meetingService.softDeleteMeeting(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/meetings/1"))
            .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteMeeting_notFound_returns404() throws Exception {
        when(meetingService.softDeleteMeeting(99L)).thenReturn(false);

        mockMvc.perform(delete("/api/meetings/99"))
            .andExpect(status().isNotFound());
    }

    // ─── GET /api/meetings/search ────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "USER")
    void searchMeetings_returns200() throws Exception {
        when(meetingService.searchMeetings(eq("Q1"), any(PageRequest.class)))
            .thenReturn(new PageImpl<>(List.of(dummyMeeting())));

        mockMvc.perform(get("/api/meetings/search?q=Q1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].title").value("Q1 Board Meeting"));
    }
}