package org.dev.pys.aop;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.dev.pys.enumarate.ProjectStatus;
import org.dev.pys.repository.ProjectRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class ProjectStatusAspect {

    private final ProjectRepository projectRepository;

    @Before("execution(public * org.dev.pys.service.ProjectService.*(..))")
    @Transactional
    public void markExpiredProjects() {
        int updated = projectRepository.markExpiredAsIncomplete(
                LocalDate.now(),
                ProjectStatus.COMPLETED,
                ProjectStatus.INCOMPLETE
        );
        if (updated > 0) {
            log.info("[AOP] {} proje INCOMPLETE'e çekildi.", updated);
        }
    }
}
