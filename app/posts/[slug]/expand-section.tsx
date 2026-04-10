"use client";

import { useState } from "react";

export function ExpandSection({ html }: { html: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 pt-6 border-t border-white/40">
      <button
        onClick={() => setOpen(!open)}
        className="expand-toggle flex items-center gap-1.5"
      >
        <span className="inline-block transition-transform" style={{ transform: open ? "rotate(90deg)" : "rotate(0)" }}>
          ▸
        </span>
        {open ? "Hide full conversation" : "View full conversation"}
      </button>
      <div className={`expand-content ${open ? "open" : ""}`}>
        <div
          className="md-content mt-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
