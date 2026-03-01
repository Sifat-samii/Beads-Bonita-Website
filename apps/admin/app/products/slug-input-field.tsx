"use client";

import { useId, useState } from "react";

type SlugInputFieldProps = {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function SlugInputField({
  label,
  name,
  required = false,
  defaultValue = "",
}: SlugInputFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const inputId = useId();
  const hasUppercase = value !== value.toLowerCase();
  const hasInvalidFormat = value.length > 0 && !slugPattern.test(value);
  const warningMessage = hasUppercase
    ? "Slug must be lowercase only."
    : hasInvalidFormat
      ? "Slug can use lowercase letters, numbers, and hyphens only."
      : "";

  return (
    <label className="block space-y-2 text-sm">
      <span>{label}</span>
      <input
        autoCapitalize="none"
        className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
        id={inputId}
        name={name}
        onChange={(event) => setValue(event.target.value)}
        pattern="[a-z0-9]+(-[a-z0-9]+)*"
        required={required}
        spellCheck={false}
        type="text"
        value={value}
      />
      {warningMessage ? (
        <p className="text-xs text-rose-100">{warningMessage}</p>
      ) : null}
    </label>
  );
}
