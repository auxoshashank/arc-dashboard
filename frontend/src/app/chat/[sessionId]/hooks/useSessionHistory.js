import { useEffect, useState } from "react";
import { handleError } from "@/lib/utils";
import { fetchSessionHistoryApi } from "@/actions/session";

export const useSessionHistory = (sessionId, userEmail, projectId, token) => {
  const [loading, setLoading] = useState(true);
  const [sessionHistory, setSessionHistory] = useState([]);

  useEffect(() => {
    const fetchSessionHistory = async () => {
      if (!sessionId || !userEmail || !token || !projectId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetchSessionHistoryApi(
          sessionId,
          projectId,
          token
        );

        if (response?.history && sessionId === response.session_id) {
          setSessionHistory(response.history);
        }
      } catch (err) {
        handleError("Failed to fetch session history. Please try again.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionHistory();
  }, [sessionId, userEmail, token, projectId]);

  return { loading, sessionHistory };
};
