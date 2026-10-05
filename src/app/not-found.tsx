import Link from "next/link";
export default function NotFound() {
  return (
    <main className="welcome">
      <h1>This door doesn’t lead anywhere.</h1>
      <Link href="/">Return to Our Space</Link>
    </main>
  );
}
