package org.dev.pys.enumarate;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ProjectStatus {
    NEW("Yeni"),
    IN_PROGRESS("Devam Ediyor"),
    COMPLETED("Tamamlandı"),
    INCOMPLETE("Eksik Tamamlandı");

    private final String label;
}