package org.dev.pys.repository;

import org.dev.pys.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameOrEmployeeEmail(String username, String email);

    boolean existsByEmployeeEmail(String email);
}
