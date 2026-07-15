import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Hammer, LogOut, MessageCircle, Menu, Plus, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-bone/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-bone">
            <Hammer className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          <span className="font-display text-[1.2rem] font-semibold tracking-tight text-indigo-800">
            Oru Aka
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            to="/workers"
            className="rounded-full px-3.5 py-2 text-[0.9rem] font-medium text-ink-600 transition-colors hover:bg-indigo-800/5 hover:text-indigo-800"
          >
            Find workers
          </Link>
          {isAuthenticated && user?.role === "client" && (
            <Link
              to="/home"
              className="rounded-full px-3.5 py-2 text-[0.9rem] font-medium text-ink-600 transition-colors hover:bg-indigo-800/5 hover:text-indigo-800"
            >
              Home
            </Link>
          )}
          {isAuthenticated && user?.role === "worker" && (
            <Link
              to="/dashboard"
              className="rounded-full px-3.5 py-2 text-[0.9rem] font-medium text-ink-600 transition-colors hover:bg-indigo-800/5 hover:text-indigo-800"
            >
              Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin"
              className="rounded-full px-3.5 py-2 text-[0.9rem] font-medium text-ink-600 transition-colors hover:bg-indigo-800/5 hover:text-indigo-800"
            >
              Admin
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to="/messages"
              className="rounded-full px-3.5 py-2 text-[0.9rem] font-medium text-ink-600 transition-colors hover:bg-indigo-800/5 hover:text-indigo-800"
            >
              Messages
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {isAuthenticated ? (
            <>
              {user?.role === "worker" && (
                <Link to="/dashboard/boost">
                  <Button variant="brass" size="sm">
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Boost listing
                  </Button>
                </Link>
              )}
              <Link
                to="/messages"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-50"
                aria-label="Messages"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={2} />
              </Link>
              <Link
                to="/profile"
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-indigo-700 text-[0.8rem] font-semibold text-bone"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user?.name?.slice(0, 2).toUpperCase()
                )}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-50 hover:text-rust-500"
              >
                <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-ink-600 sm:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-ink-100 bg-bone px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-2">
            <Link to="/workers" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-[0.9rem] font-medium text-ink-700 hover:bg-ink-50">
              Find workers
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === "client" && (
                  <Link to="/home" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-[0.9rem] font-medium text-ink-700 hover:bg-ink-50">
                    Home
                  </Link>
                )}
                {user?.role === "worker" && (
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-[0.9rem] font-medium text-ink-700 hover:bg-ink-50">
                    Dashboard
                  </Link>
                )}
                {user?.role === "worker" && (
                  <Link to="/dashboard/boost" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-[0.9rem] font-medium text-brass-600 hover:bg-brass-50">
                    Boost listing
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-[0.9rem] font-medium text-ink-700 hover:bg-ink-50">
                    Admin
                  </Link>
                )}
                <Link to="/messages" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-[0.9rem] font-medium text-ink-700 hover:bg-ink-50">
                  Messages
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-[0.9rem] font-medium text-ink-700 hover:bg-ink-50">
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="rounded-lg px-3 py-2.5 text-left text-[0.9rem] font-medium text-rust-500 hover:bg-rust-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-[0.9rem] font-medium text-ink-700 hover:bg-ink-50">
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="rounded-lg bg-indigo-700 px-3 py-2.5 text-center text-[0.9rem] font-semibold text-bone">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


