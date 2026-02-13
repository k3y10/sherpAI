"use client";

import { useMemo, useRef, useState } from "react";
import type { ForecastZone, Observation } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const quickActions = [
  "Summarize selected zone",
  "Show recent avalanches",
  "Safest travel options",
  "What changed recently?",
];

type ChatMessage = {
  id: string;
  author: "user" | "sherpai";
  content: string;
};

function formatResponse({
  zone,
  observations,
}: {
  zone?: ForecastZone;
  observations: Observation[];
}) {
  const recentAvalanches = observations.filter((item) => item.type === "Avalanche");
  const topProblems = zone?.problems.map((problem) => `${problem.type} (${problem.likelihood})`) ?? [];
  return {
    summary: zone
      ? `${zone.name} is sitting at hazard ${zone.hazardLevel} with ${zone.confidenceScore}% confidence.`
      : "Select a zone to see tailored guidance.",
    keyProblems: topProblems.length ? topProblems.join(", ") : "No primary problems reported.",
    changed: recentAvalanches[0]
      ? `Newest avalanche: ${recentAvalanches[0].summary}`
      : "No new avalanche activity reported.",
    approach: zone?.travelAdvice.join(" ") ?? "Stick to low-angle terrain and keep spacing.",
    confidence: zone ? `${zone.confidenceScore}%` : "--",
  };
}

export function SherpAIWidget({
  zone,
  observations,
  onSelectZone,
  onToggleAvalanches,
  onHighlightHighest,
  onFocusObservationType,
}: {
  zone?: ForecastZone;
  observations: Observation[];
  onSelectZone: (zoneName: string) => void;
  onToggleAvalanches: () => void;
  onHighlightHighest: () => void;
  onFocusObservationType: (type?: Observation["type"]) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      author: "sherpai",
      content: "Ask me about the snowpack, zones, or what changed in the last hour.",
    },
  ]);
  const [input, setInput] = useState("");
  const idCounter = useRef(0);

  const response = useMemo(() => formatResponse({ zone, observations }), [zone, observations]);

  const handleIntent = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("show avalanches")) {
      onToggleAvalanches();
      onFocusObservationType("Avalanche");
    }
    if (lower.includes("highest hazard")) {
      onHighlightHighest();
    }
    const match = lower.match(/select\s+([a-z\s]+)/i);
    if (match) {
      onSelectZone(match[1].trim());
    }
  };

  const handleSend = (content: string) => {
    if (!content.trim()) return;
    const id = `msg-${idCounter.current++}`;
    setMessages((prev) => [
      { id, author: "user", content },
      {
        id: `${id}-reply`,
        author: "sherpai",
        content: `Summary: ${response.summary}\nKey problems: ${response.keyProblems}\nWhat changed: ${response.changed}\nSuggested approach: ${response.approach}\nConfidence: ${response.confidence}`,
      },
      ...prev,
    ]);
    handleIntent(content);
    setInput("");
  };

  return (
    <div className="glass-panel flex flex-col gap-4 rounded-3xl p-4 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">SherpAI</p>
            <p className="text-sm font-semibold">Companion</p>
          </div>
        </div>
        <span className="rounded-full bg-[var(--panel-muted)] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-muted">
          Live
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <button
            key={action}
            onClick={() => handleSend(action)}
            className="chip px-3 py-2 text-xs font-semibold text-muted transition hover:text-foreground"
          >
            {action}
          </button>
        ))}
      </div>
      <div className="max-h-64 overflow-y-auto space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "whitespace-pre-line rounded-2xl px-3 py-2 text-xs",
              message.author === "user"
                ? "ml-auto bg-[var(--accent)] text-white"
                : "bg-[var(--panel-muted)] text-foreground"
            )}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSend(input);
          }}
          placeholder="Ask SherpAI to act..."
          className="flex-1 rounded-full border border-[var(--border)] bg-transparent px-4 py-2 text-xs outline-none"
        />
        <button
          onClick={() => handleSend(input)}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
