import { askStream } from "@/services/agent";
import { useCallback, useRef, useState } from "react";

const STATUS_STEPS: StreamStatus[] = [
  "routing",
  "retrieving",
  "researching",
  "writing",
  "reviewing",
];

function useAskStream() {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<StreamStatus | null>(null);
  const [route, setRoute] = useState<{
    category: string;
    confidence: RouteConfidence;
    reason: string;
  } | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [cacheHit, setCacheHit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = () => {
    setCurrentStatus(null);
    setRoute(null);
    setReport(null);
    setCacheHit(false);
    setError(null);
  };

  const handleEvent = useCallback((event: StreamEvent) => {
    switch (event.type) {
      case "status":
        setCurrentStatus(event.status);
        break;
      case "route":
        setRoute({
          category: event.category,
          confidence: event.confidence,
          reason: event.reason,
        });
        break;
      case "cached":
        setCacheHit(true);
        setReport({ ...event.content, cached: true });
        break;
      case "result":
        setReport({
          title: event.title,
          summary: event.summary,
          sections: event.sections,
          score: event.score,
          approved: event.approved,
          cached: event.cached,
        });
        break;
      case "error":
        setError(event.message);
        break;
      case "done":
        break;
    }
  }, []);

  const submit = useCallback(
    async (question: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      reset();
      setLoading(true);
      try {
        await askStream(question, handleEvent, controller.signal);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
        setCurrentStatus(null);
      }
    },
    [handleEvent],
  );
  return {
    loading,
    currentStatus,
    statusSteps: STATUS_STEPS,
    route,
    report,
    cacheHit,
    error,
    submit,
  };
}
export default useAskStream;
