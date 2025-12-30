import { replaceParams } from "@/lib/utils";

const isClient = typeof window !== "undefined";

const API_BASE_URL = isClient
  ? process.env.NEXT_PUBLIC_DAMIA_API_BASE_URL
  : process.env.DAMIA_API_BASE_URL;

export const API_ENDPOINTS = {
  projectDetail: `${API_BASE_URL}/apigw/project/get/{projectId}`,
  getAllKnowledgeBase: `${API_BASE_URL}/apigw/template?category=data_sources`,
  knowledgeBase: `${API_BASE_URL}/apigw/data/ops?project_id={projectId}`,
  getSelectedKnowledgeBaseDetail: `${API_BASE_URL}/apigw/data/ops/get/{data_ops_id}`,
  createDataOps: `${API_BASE_URL}/apigw/data/ops/create`,
  getOpsExecutionStatus: `${API_BASE_URL}/apigw/data/ops/get/{data_ops_id}`,
  dataOpsExecution: `${API_BASE_URL}/apigw/execution/data/ops/{data_ops_id}`,
  fetchSolutionData: `${API_BASE_URL}/apigw/solution/ai/get/{solutionId}`,
  createAiSolution: `${API_BASE_URL}/apigw/solution/ai/create`,
  getAiSolutions: `${API_BASE_URL}/apigw/solution/ai?project_id={projectId}`,
  getAllAiSolutions: `${API_BASE_URL}/apigw/solution/ai`,
  getAllProjects: `${API_BASE_URL}/apigw/project?page_size=50`,
  createProject: `${API_BASE_URL}/apigw/project/create`,
  invokeExecuteAiSolution: `${API_BASE_URL}/apigw/execution/ai`,
  pollInvokeAiSolution: `${API_BASE_URL}/apigw/execution/get/{executionId}`,
  knowledgeGraph: `${API_BASE_URL}/apigw/knowledge/get/{knowledgeId}`,
  sessionHistory: `${API_BASE_URL}/apigw/execution/history/session/{session_id}`,
  userSessionsHistory: `${API_BASE_URL}/apigw/execution/history/user/{userId}?solution={solutionId}`,
  saveAgentConfig: `${API_BASE_URL}/apigw/solution/ai/update/properties/{solution_id}`,
  fetchModels: `${API_BASE_URL}/apigw/template?category=llm_model`,
  fetchCreatedKnowledgeBase: `${API_BASE_URL}/apigw/data/ops?execution_status=Completed&project_id={projectId}`,
  updateProjectData: `${API_BASE_URL}/apigw/project/update/info/{project_id}`,
  updateSolutionData: `${API_BASE_URL}/apigw/solution/ai/update/info/{solution_id}`,
  fetchRbacSetupData: `${API_BASE_URL}/apigw/access/list/required/roles/{project_id}`,
  fetchUserOrgRoles: `${API_BASE_URL}/apigw/access/list/user/org/roles`,
  fetchUserRolesBase: `${API_BASE_URL}/apigw/access/get/allowed/project/roles`,
  fetchUserRoles: `${API_BASE_URL}/apigw/access/list/user/project/roles?project_id={project_id}`,
  fetchProjectRelatedGroups: `${API_BASE_URL}/apigw/access/get/project/groups/{project_id}`,
  updateProjectRelatedGroups: `${API_BASE_URL}/apigw/access/update/project/groups/{project_id}`,
  deleteAiSolution: `${API_BASE_URL}/apigw/solution/ai/delete/{solution_id}`,
  deleteAddedKnowledgeBase: `${API_BASE_URL}/apigw/data/ops/delete/{data_ops_id}`,
  deleteProject: `${API_BASE_URL}/apigw/project/delete/{project_id}`,
  deleteUserHistory: `${API_BASE_URL}/apigw/execution/delete/user/history/{user_id}`,
  deleteSessionHistory: `${API_BASE_URL}/apigw/execution/delete/session/history/{session_id}`,
  getAllMcpServers: `${API_BASE_URL}/apigw/mcp/server?project_id={projectId}`,
  createMcpServer: `${API_BASE_URL}/apigw/mcp/server/register`,
  getSelectedMcpServerDetails: `${API_BASE_URL}/apigw/mcp/server/get/{server_id}`,
  getAllMcpServerTools: `${API_BASE_URL}/apigw/mcp/tools?server_id={serverId}`,
  getAllProjectTools: `${API_BASE_URL}/apigw/mcp/tools?project_id={projectId}`,
  getSelectedMcpServerToolDetails: `${API_BASE_URL}/apigw/mcp/tools/get/{tool_id}`,
  refreshMcpServer: `${API_BASE_URL}/apigw/mcp/server/refresh/{server_id}`,
  deleteSelectedMcpServer: `${API_BASE_URL}/apigw/mcp/server/remove/{server_id}`,
  recommendedSolutions: `${API_BASE_URL}/apigw/solution/ai/recommended?query={query}&top_k={top_k}`,
  getAgentTemplates: `${API_BASE_URL}/apigw/template?category=agents`,
  fetchThemeConfig: `${API_BASE_URL}/apigw/settings/system/get`,
  setThemeConfig: `${API_BASE_URL}/apigw/settings/system/set`,
  getModelsTemplateList: `${API_BASE_URL}/apigw/template/list/models`,
  createModel: `${API_BASE_URL}/apigw/model/create`,
  getAllModels: `${API_BASE_URL}/apigw/model/list`,
  getAllModelsForProject: `${API_BASE_URL}/apigw/model/list/all`,
  updateModel: `${API_BASE_URL}/apigw/model/update/{model_id}`,
  deleteModel: `${API_BASE_URL}/apigw/model/delete/{model_id}`,
  getAiSolutionAgentCards: `${API_BASE_URL}/apigw/solution/ai/{solution_id}/.well-known/agent-card.json`,
};
export const getApiEndpoint = (endpoint, params) => {
  return replaceParams(endpoint, params);
};
