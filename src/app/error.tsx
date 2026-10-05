"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="welcome">
      <h1>Let’s try opening your space again.</h1>
      <p>Your saved things remain in your home.</p>
      <button className="primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
