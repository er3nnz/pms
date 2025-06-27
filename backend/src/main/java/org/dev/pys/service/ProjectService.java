package org.dev.pys.service;

import org.dev.pys.dto.request.CreateProjectRequest;
import org.dev.pys.dto.request.UpdateProjectRequest;
import org.dev.pys.dto.request.UpdateProjectStatusRequest;
import org.dev.pys.dto.response.ProjectResponse;

import java.util.List;

public interface ProjectService {

    ProjectResponse createProject(CreateProjectRequest request);

    ProjectResponse updateProject(Long id, UpdateProjectRequest request);

    ProjectResponse getProjectById(Long id);

    List<ProjectResponse> getAllProjects();

    void deleteProject(Long id);

    ProjectResponse updateProjectStatus(Long id, UpdateProjectStatusRequest request);
}
