import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're on the waitlist — Travingat",
  description: "You've confirmed your spot on the Travingat waitlist. We'll let you know when it's launched.",
};

interface Props {
  searchParams: Promise<{ already?: string; error?: string }>;
}

export default async function WaitlistConfirmedPage({ searchParams }: Props) {
  const params = await searchParams;
  const isAlready = params.already === "true";
  const errorType = params.error;
  const hasError = !!errorType;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* Card */}
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: 24,
          padding: "56px 40px",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: hasError ? "#1c1010" : "#0e1c12",
            border: `1.5px solid ${hasError ? "#3d1414" : "#163d22"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
            fontSize: 28,
          }}
        >
          {hasError ? "✕" : "✓"}
        </div>

        {/* Heading */}
        <h1
          style={{
            margin: "0 0 12px",
            fontSize: 26,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "-0.4px",
            lineHeight: 1.25,
          }}
        >
          {hasError
            ? errorType === "expired"
              ? "Link expired"
              : "Something went wrong"
            : isAlready
            ? "Already confirmed"
            : "You're on the waitlist."}
        </h1>

        {/* Body */}
        <p
          style={{
            margin: "0 0 36px",
            fontSize: 15,
            lineHeight: 1.65,
            color: "#787878",
          }}
        >
          {hasError
            ? errorType === "expired"
              ? "This confirmation link has expired (they are only valid for 24 hours). Please sign up again to get a new link."
              : "We couldn't confirm your spot. The link may be invalid. Please try signing up again."
            : isAlready
            ? "Your spot was already confirmed — you're all set. We'll let you know when Travingat launches."
            : "We'll let you know when it's launched."}
        </p>

        {/* Back to homepage */}
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "#fff",
            color: "#000",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            padding: "12px 28px",
            borderRadius: 999,
            letterSpacing: "-0.1px",
          }}
        >
          Back to home
        </Link>
      </div>

      {/* Footer wordmark */}
      <p
        style={{
          marginTop: 32,
          fontSize: 13,
          color: "#3a3a3a",
          letterSpacing: "-0.2px",
        }}
      >
        travingat
      </p>
    </main>
  );
}
