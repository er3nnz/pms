package org.dev.pys.repository;

import org.dev.pys.entity.Project;
import org.dev.pys.enumarate.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Modifying
    @Query("""
                update Project p
                set p.status = :newStatus
                where p.endDate < :today
                  and p.status <> :completedStatus
                  and p.status <> :newStatus
            """)
    int markExpiredAsIncomplete(LocalDate today,
                                ProjectStatus completedStatus,
                                ProjectStatus newStatus);
}
