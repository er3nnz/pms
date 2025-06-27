package org.dev.pys.repository;

import org.dev.pys.entity.ProjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, Long> {

    Optional<ProjectAssignment> findByProject_IdAndEmployee_Id(Long projectId, Long employeeId);

    List<ProjectAssignment> findByProject_Id(Long projectId);

    List<ProjectAssignment> findByEmployee_Id(Long employeeId);
}
