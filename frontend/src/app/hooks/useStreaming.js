import { pollInvokeAiSolution } from "@/actions/aiSolution";
import { useEffect, useRef, useState } from "react";

class PollingTimeoutError extends Error {
  constructor(message = "Polling timed out") {
    super(message);
    this.name = "PollingTimeoutError";
  }
}

const useStreaming = (
  projectId,
  token,
  { interval = 300, timeout = 120000 } = {}
) => {
  const [streamingStates, setStreamingStates] = useState({});
  const intervalRefs = useRef({});
  const startTimes = useRef({});
  const pollingFlags = useRef({});

  useEffect(() => {
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
      intervalRefs.current = {};
    };
  }, []);

  const pollStatus = async (executionId) => {
    if (pollingFlags.current[executionId]) return;
    pollingFlags.current[executionId] = true;

    try {
      const data = await pollInvokeAiSolution(executionId, projectId, token);

      setStreamingStates((prev) => ({
        ...prev,
        [executionId]: {
          ...prev[executionId],
          response: data,
        },
      }));

      if (data?.status?.status === "Completed") {
        stopStreaming(executionId, data);
      }

      if (Date.now() - startTimes.current[executionId] >= timeout) {
        stopStreaming(executionId);
        setStreamingStates((prev) => ({
          ...prev,
          [executionId]: {
            ...prev[executionId],
            error: new PollingTimeoutError(),
          },
        }));
        return;
      }

      if (data?.status?.status === "Failed") {
        stopStreaming(executionId, data);
        setStreamingStates((prev) => ({
          ...prev,
          [executionId]: {
            ...prev[executionId],
            error: new Error("Invocation failed."),
          },
        }));
        return;
      }
    } catch (err) {
      stopStreaming(executionId);
      setStreamingStates((prev) => ({
        ...prev,
        [executionId]: {
          ...prev[executionId],
          error: err,
        },
      }));
    } finally {
      pollingFlags.current[executionId] = false;
    }
  };

  const stopStreaming = (executionId, data) => {
    setStreamingStates((prev) => ({
      ...prev,
      [executionId]: {
        ...prev[executionId],
        streaming: false,
        response: data || prev[executionId]?.response || null,
      },
    }));
    clearInterval(intervalRefs.current[executionId]);
    delete intervalRefs.current[executionId];
    delete pollingFlags.current[executionId];
    delete startTimes.current[executionId];
  };

  const startStreaming = (executionId) => {
    setStreamingStates((prev) => ({
      ...prev,
      [executionId]: {
        streaming: true,
        response: null,
        error: null,
      },
    }));

    clearInterval(intervalRefs.current[executionId]);
    startTimes.current[executionId] = Date.now();

    intervalRefs.current[executionId] = setInterval(() => {
      if (!pollingFlags.current[executionId]) {
        pollStatus(executionId);
      }
    }, interval);
  };

  const stopAllStreaming = () => {
    Object.keys(intervalRefs.current).forEach(stopStreaming);
  };

  return {
    startStreaming,
    stopStreaming,
    stopAllStreaming,
    streamingStates, // { [executionId]: { streaming, response, error } }
  };
};

export { PollingTimeoutError };
export default useStreaming;
