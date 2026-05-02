-- V2__audit_log.sql: Audit log table for tracking all changes

CREATE TABLE audit_log (
    id           BIGSERIAL PRIMARY KEY,
    entity_name  VARCHAR(100)  NOT NULL,
    entity_id    BIGINT,
    action       VARCHAR(50)   NOT NULL,  -- CREATE, UPDATE, DELETE
    performed_by VARCHAR(100),
    details      TEXT,
    ip_address   VARCHAR(50),
    created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_entity    ON audit_log(entity_name, entity_id);
CREATE INDEX idx_audit_action    ON audit_log(action);
CREATE INDEX idx_audit_created   ON audit_log(created_at);
CREATE INDEX idx_audit_performed ON audit_log(performed_by);