import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-[3rem] font-semibold text-indigo-700">404</p>
      <h1 className="mt-2 font-display text-[1.3rem] font-semibold text-ink-800">Page not found</h1>
      <p className="mt-2 text-[0.9rem] text-ink-400">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link to="/">
        <Button className="mt-6">Back to home</Button>
      </Link>
    </div>
  );
}
