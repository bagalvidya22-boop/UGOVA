"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase, isSupabaseConnected } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/mockData";
import {
  Menu,
  X,
  Home,
  Briefcase,
  FileText,
  GraduationCap,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      if (isSupabaseConnected()) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const { data } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          if (data) setRole(data.role);
        }
      } else {
        // Mock auth fallback
        const mockUser = getCurrentUser();
        if (mockUser) {
          setUser({ id: mockUser.id, email: mockUser.email });
          setRole(mockUser.role);
        }
      }
    };
    getUser();

    if (isSupabaseConnected()) {
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event: string, session: Session | null) => {
          if (session?.user) {
            setUser(session.user);
            const { data } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .single();
            if (data) setRole(data.role);
          } else {
            setUser(null);
            setRole("");
          }
        }
      );
      return () => listener.subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConnected()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('ugova_user');
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/schemes", label: "Schemes", icon: FileText },
    { href: "/exams", label: "Exams", icon: GraduationCap },
  ];

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ugova-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-ugova-800 tracking-tight">
              UGOVA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-ugova-700 hover:bg-ugova-50 transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-2 ml-4">
                <NotificationBell />
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-ugova-50 transition-colors">
                    <div className="w-8 h-8 bg-ugova-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-ugova-700" />
                    </div>
                    <span className="max-w-[100px] truncate">
                      {user.email?.split("@")[0]}
                    </span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-ugova-50"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-ugova-50"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    {role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ugova-700 hover:bg-ugova-50"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-ugova-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-ugova-600 text-white rounded-lg hover:bg-ugova-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-ugova-50"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-ugova-700 hover:bg-ugova-50"
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-ugova-700 hover:bg-ugova-50"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-ugova-700 hover:bg-ugova-50"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                {role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ugova-700 hover:bg-ugova-50"
                  >
                    <Shield className="w-5 h-5" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-ugova-700 hover:bg-ugova-50"
                >
                  <LogOut className="w-5 h-5" />
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-ugova-600 text-white"
                >
                  <User className="w-5 h-5" />
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
