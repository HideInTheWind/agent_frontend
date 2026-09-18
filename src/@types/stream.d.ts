// types/stream.ts

type StreamStatus =
  | "routing"
  | "retrieving"
  | "researching"
  | "writing"
  | "reviewing";

type RouteConfidence = "high" | "medium" | "low";

interface ReportData {
  title: string;
  summary: string;
  sections: string[];
  score: number;
  approved: boolean;
  cached?: boolean;
}

type StreamEvent =
  | { type: "status"; status: StreamStatus; message: string }
  | {
      type: "route";
      category: string;
      confidence: RouteConfidence;
      reason: string;
    }
  | {
      type: "result";
      title: string;
      summary: string;
      sections: string[];
      score: number;
      approved: boolean;
      cached: boolean;
    }
  | { type: "cached"; content: ReportData }
  | { type: "error"; message: string }
  | { type: "done" };
