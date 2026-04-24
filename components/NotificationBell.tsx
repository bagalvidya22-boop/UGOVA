"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCircle, AlertCircle, Clock, Info } from "lucide-react";
import { getCurrentUser, getFromStorage, Notification } from "@/lib/mockData";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    const stored = getFromStorage<Notification[]>('ugova_notifications', []);
    const userNotifs = stored.filter(n => n.userId === user.id);
    setNotifications(userNotifs);
    setUnreadCount(userNotifs.filter(n => !n.read).length);
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'deadline': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'alert': return <Bell className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-ugova-700 hover:bg-ugova-50 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-sm text-slate-900">Notifications</span>
            <Link
              href="/notifications"
              className="text-xs text-ugova-600 hover:text-ugova-700"
              onClick={() => setIsOpen(false)}
            >
              View All
            </Link>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No notifications yet</p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {notifications.slice(0, 5).map(notif => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                    !notif.read ? 'bg-ugova-50/50' : ''
                  }`}
                >
                  {getIcon(notif.type)}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{notif.message}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notif.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 bg-ugova-500 rounded-full shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
