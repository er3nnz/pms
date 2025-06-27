package org.dev.pys.service;

import org.dev.pys.entity.AuditLog;

import java.util.List;

public interface AuditLogService {
    void log(String username, String action, String description);

    List<AuditLog> getAllLogs();
}