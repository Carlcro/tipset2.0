import React from "react";

export default function SubmitButton({ children, type = "submit", onClick }) {
  return (
    <button
      className="rounded-sm bg-frost3 text-slate border border-polarNight px-3 py-1 mt-2 max-w-[260px]"
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
