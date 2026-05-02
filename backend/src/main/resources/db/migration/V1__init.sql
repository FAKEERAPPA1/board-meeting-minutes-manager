CREATE TABLE board_meeting_minutes (
    id            BIGSERIAL PRIMARY KEY,
    title         VARCHAR(255)  NOT NULL,
    meeting_date  DATE          NOT NULL,
    attendees     TEXT,
    agenda        TEXT,
    minutes_text  TEXT          NOT NULL,
    status        VARCHAR(50)   NOT NULL DEFAULT 'DRAFT',
    ai_description TEXT,
    ai_recommendations TEXT,
    ai_report      TEXT,
    is_fallback    BOOLEAN       DEFAULT FALSE,
    created_by    VARCHAR(100),
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    deleted       BOOLEAN       NOT NULL DEFAULT FALSE
);

-- Indexes on key fields
CREATE INDEX idx_meeting_date  ON board_meeting_minutes(meeting_date);
CREATE INDEX idx_status        ON board_meeting_minutes(status);
CREATE INDEX idx_deleted       ON board_meeting_minutes(deleted);
CREATE INDEX idx_created_by    ON board_meeting_minutes(created_by);