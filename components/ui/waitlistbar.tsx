"use client";

import { useEffect } from "react";

import { useWaitlistForm } from "@/lib/use-waitlist-form";

interface WaitlistBarProps {
  className?: string;
  formClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  messageClassName?: string;
  inputPlaceholder?: string;
  submitLabel?: string;
  loadingLabel?: string;
  showMessage?: boolean;
  onSuccess?: () => void;
}

export function WaitlistBar({
  className,
  formClassName,
  inputClassName,
  buttonClassName,
  messageClassName,
  inputPlaceholder = "Enter your email",
  submitLabel = "Get early access",
  loadingLabel = "Joining...",
  showMessage = true,
  onSuccess,
}: WaitlistBarProps) {
  const { email, setEmail, status, message, submit } = useWaitlistForm();
  const isLoading = status === "loading";

  useEffect(() => {
    if (status === "success") {
      onSuccess?.();
    }
  }, [onSuccess, status]);

  const containerClassName = ["w-full", className].filter(Boolean).join(" ");
  const formClasses = [
    "flex h-15 w-full max-w-[640px] items-center justify-between overflow-hidden rounded-full border border-white-900 bg-black pl-6 pr-1",
    formClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const inputClasses = [
    "w-full bg-transparent text-[20px] font-medium leading-7 tracking-[-0.5px] text-white placeholder:text-white-800 focus:outline-none",
    inputClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const buttonClasses = [
    "ds-font-display h-13 shrink-0 rounded-full bg-white px-8 text-[20px] font-medium leading-7 tracking-[-0.5px] text-black transition hover:bg-white-100 disabled:opacity-50",
    buttonClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const messageClasses = [
    "mt-3 text-sm",
    status === "success" || status === "duplicate" ? "text-green-400" : "text-red-400",
    messageClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassName}>
      <form onSubmit={submit} className={formClasses}>
        <input
          type="email"
          placeholder={inputPlaceholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClasses}
        />
        <button type="submit" disabled={isLoading} className={buttonClasses}>
          {isLoading ? loadingLabel : submitLabel}
        </button>
      </form>
      {showMessage && message ? <p className={messageClasses}>{message}</p> : null}
    </div>
  );
}
