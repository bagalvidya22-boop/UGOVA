"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  Calendar,
  ExternalLink,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Application, getCurrentUser, Notification } from "@/lib/mockData";
import { sendDeadlineReminder } from "@/lib/mailService";

export default function DashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({ total: 0, jobs: 0, schemes: 0, exams: 0 });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      toast.error("Please login to view dashboard");
      router.push("/login");
      return;
    }

    // Load applications from localStorage
    const stored = localStorage.getItem('ugova_applications');
    if (stored) {
      const allApps: Application[] = JSON.parse(stored);
      const userApps = allApps.filter(a => a.userId === user.id);
      setApplications(userApps);
      setStats({
        total: userApps.length,
        jobs: userApps.filter(a => a.type === 'job').length,
        schemes: userApps.filter(a => a.type === 'scheme').length,
        exams: userApps.filter(a => a.type === 'exam').length,
      });
    }

    // Load notifications
    const notifStored = localStorage.getItem('ugova_notifications');
    if (notifStored) {
      const allNotifs: Notification[] = JSON.parse(notifStored);
      setNotifications(allNotifs.filter(n => n.userId === user.id).slice(0, 5));
    }
  }, [router]);

  const getDaysRemaining = (lastDate: string) => {
    const today = new Date();
    const deadline = new Date(lastDate);
    const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleReminder = async (app: Application) => {
    const user = getCurrentUser();
    if (!user) return;
    const days = getDaysRemaining(app.lastDate);
    await sendDeadlineReminder(
      user.email, user.name, app.title, app.lastDate,
      days > 0 ? days.toString() : '0', '#'
    );
    toast.success("Reminder email sent!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-ugova-600" />
          Your Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Track your applications, deadlines, and AI insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-5 h-5 text-ugova-600" />
            <span className="text-2xl font-bold text-slate-900">{stats.jobs}</span>
          </div>
          <p className="text-sm text-slate-500">Job Applications</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-slate-900">{stats.schemes}</span>
          </div>
          <p className="text-sm text-slate-500">Schemes Applied</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <span className="text-2xl font-bold text-slate-900">{stats.exams}</span>
          </div>
          <p className="text-sm text-slate-500">Exams Tracked</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
          </div>
          <p className="text-sm text-slate-500">Total Applications</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Recent Applications</h2>
              <Link href="/jobs" className="text-sm text-ugova-600 hover:text-ugova-700 flex items-center gap-1">
                Browse More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="p-8 text-center">
                <LayoutDashboard className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500">No applications yet</p>
                <p className="text-sm text-slate-400 mt-1">Start by browsing jobs, schemes, or exams</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 10).map((app) => {
                  const daysLeft = getDaysRemaining(app.lastDate);
                  return (
                    <div key={app.id} className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        app.type === 'job' ? 'bg-ugova-50' :
                        app.type === 'scheme' ? 'bg-green-50' : 'bg-purple-50'
                      }`}>
                        {app.type === 'job' && <Briefcase className="w-5 h-5 text-ugova-600" />}
                        {app.type === 'scheme' && <FileText className="w-5 h-5 text-green-600" />}
                        {app.type === 'exam' && <GraduationCap className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 truncate">{app.title}</h3>
                        <p className="text-sm text-slate-500">{app.organization}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Applied: {app.appliedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last Date: {app.lastDate}
                          </span>
                        </div>
                        {daysLeft > 0 && daysLeft <= 7 && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit">
                            <AlertCircle className="w-3 h-3" />
                            {daysLeft} days remaining!
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          app.status === 'applied' ? 'bg-blue-50 text-blue-700' :
                          app.status === 'in-progress' ? 'bg-yellow-50 text-yellow-700' :
                          app.status === 'selected' ? 'bg-green-50 text-green-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {app.status}
                        </span>
                        {daysLeft > 0 && (
                          <button
                            onClick={() => handleReminder(app)}
                            className="text-xs text-ugova-600 hover:text-ugova-700 underline"
                          >
                            Remind me
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/jobs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <Briefcase className="w-5 h-5 text-ugova-600" />
                <span className="text-sm text-slate-700">Browse Jobs</span>
              </Link>
              <Link href="/schemes" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="text-sm text-slate-700">Explore Schemes</span>
              </Link>
              <Link href="/exams" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-slate-700">Track Exams</span>
              </Link>
              <Link href="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <CheckCircle className="w-5 h-5 text-slate-600" />
                <span className="text-sm text-slate-700">Update Profile</span>
              </Link>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-400">No new notifications</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-3 rounded-lg text-sm ${
                    notif.type === 'deadline' ? 'bg-amber-50 text-amber-700' :
                    notif.type === 'success' ? 'bg-green-50 text-green-700' :
                    notif.type === 'alert' ? 'bg-red-50 text-red-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    <p className="font-medium">{notif.title}</p>
                    <p className="text-xs mt-1 opacity-80">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
