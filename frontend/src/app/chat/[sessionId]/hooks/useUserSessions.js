import { useEffect, useState } from "react";
import { handleError } from "@/lib/utils";
import { fetchUserSessionsApi } from "@/actions/session";

export const useUserSessions = (userId, solutionId, projectId, token) => {
  const [loading, setLoading] = useState(true);
  const [userSessions, setUserSessions] = useState([]);

  useEffect(() => {
    const fetchUserSessions = async () => {
      if (!userId || !token || !solutionId || !projectId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchUserSessionsApi(
          userId,
          solutionId,
          projectId,
          token
        );

        if (
          response?.history &&
          Object.keys(response.history)?.length > 0 &&
          userId === response.user_id
        ) {
          const sessions = Object.keys(response.history).map((sessionId) => {
            const session = response.history[sessionId].find(
              (session) => session.result !== null,
            );
            return {
              id: sessionId,
              createdAt: session?.created_at,
              executionId: session?.execution_id,
              name: session?.result?.human?.content || "New Chat",
            };
          });
          setUserSessions(sessions.reverse());
        }
      } catch (err) {
        handleError("Failed to fetch user sessions. Please try again.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSessions();
  }, [solutionId, userId, token, projectId]);

  return { loading, userSessions, setUserSessions };
};
