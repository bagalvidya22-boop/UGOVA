"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  Trash2,
  BellOff,
} from "lucide-react";
import { getCurrentUser, Notification, setToStorage, getFromStorage } from "@/lib/mockData";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      toast.error("Please login to view notifications");
      router.push("/login");
      return;
    }

    const stored = getFromStorage<Notification[]>('ugova_notifications', []);
    const userNotifs = stored.filter(n => n.userId === user.id);
    if (userNotifs.length === 0) {
      // Add mock notifications
      const mockNotifs: Notification[] = [
        {
          id: 'notif-1',
          userId: user.id,
          title: 'Welcome to UGOVA!',
          message: 'Your account is set up. Start exploring opportunities now.',
          type: 'success',
          read: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'notif-2',
          userId: user.id,
          title: 'New Job Alert',
          message: '5 new government jobs match your profile. Check them out!',
          type: 'update',
          read: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'notif-3',
          userId: user.id,
          title: 'Deadline Reminder',
          message: 'UPSC CSE Prelims application closes in 3 days. Apply now!',
          type: 'deadline',
          read: false,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      setToStorage('ugova_notifications', [...stored, ...mockNotifs]);
      setNotifications(mockNotifs);
    } else {
      setNotifications(userNotifs);
    }
  }, [router]);

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    const allStored = getFromStorage<Notification[]>('ugova_notifications', []);
    const updatedAll = allStored.map(n => n.id === id ? { ...n, read: true } : n);
    setToStorage('ugova_notifications', updatedAll);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    const allStored = getFromStorage<Notification[]>('ugova_notifications', []);
    const updatedAll = allStored.filter(n => n.id !== id);
    setToStorage('ugova_notifications', updatedAll);
    toast.success("Notification removed");
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'deadline': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'alert': return <Bell className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'deadline': return 'bg-amber-50 border-amber-100';
      case 'success': return 'bg-green-50 border-green-100';
      case 'alert': return 'bg-red-50 border-red-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Bell className="w-8 h-8 text-ugova-600" />
          Notifications
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              {unreadCount} new
            </span>
          )}
        </h1>
        <p className="text-slate-500 mt-1">Stay updated on deadlines, applications, and new opportunities</p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <BellOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No notifications yet</p>
          <p className="text-sm text-slate-400 mt-1">We&apos;ll notify you about deadlines and updates</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative p-5 rounded-xl border ${getBgColor(notif.type)} ${
                !notif.read ? 'ring-1 ring-ugova-200' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className={`font-semibold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                        {!notif.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-ugova-500 rounded-full" />
                        )}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-ugova-600 hover:bg-ugova-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
