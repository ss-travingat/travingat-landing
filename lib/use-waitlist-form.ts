"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error" | "duplicate";

export function useWaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.status === 409) {
        setStatus("duplicate");
        setMessage("You're already on the waitlist!");
        return;
      }

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      setStatus("success");
      setMessage("You're in! Check your email.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return { email, setEmail, status, message, submit };
}
