const paths = {
  login() {
    return "/";
  },
  home() {
    return "/home";
  },
  studio() {
    return "/studio";
  },
  store() {
    return "/store";
  },
  projectSolutions(projectId) {
    return `studio/project/${projectId}`;
  },
  projectKnowledgeBase(projectId) {
    return `studio/project/${projectId}/knowledge-base`;
  },
  projectModels(projectId) {
    return `studio/project/${projectId}/models`;
  },
  projectRoles(projectId) {
    return `studio/project/${projectId}/roles`;
  },
};
