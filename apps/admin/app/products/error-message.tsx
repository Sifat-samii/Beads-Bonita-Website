"use client";

import { useEffect } from "react";

type ErrorMessageProps = {
  message?: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  useEffect(() => {
    if (!message) {
      return;
    }

    void fetch("/products/flash-error", {
      method: "POST",
      credentials: "same-origin",
    });
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-rose-300/20 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
      {message}
    </div>
  );
}
