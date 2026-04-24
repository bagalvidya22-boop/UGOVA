"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Briefcase,
  FileText,
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Search,
  X,
} from "lucide-react";
import { mockUsers, mockJobs, mockSchemes, mockExams, getCurrentUser, UserProfile, Document } from "@/lib/mockData";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'schemes' | 'exams' | 'verify'>('overview');
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      toast.error("Admin access required");
      router.push("/");
    }
  }, [router]);

  // Verify admin
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-500 mt-2">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalUsers: users.length,
    totalJobs: mockJobs.length,
    totalSchemes: mockSchemes.length,
    totalExams: mockExams.length,
    pendingVerifications: users.reduce((acc, u) => acc + u.documents.filter(d => d.status === 'pending').length, 0),
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerifyDocument = (userId: string, docId: string, status: 'verified' | 'rejected') => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          documents: u.documents.map(d =>
            d.id === docId ? { ...d, status } : d
          )
        };
      }
      return u;
    }));
    toast.success(`Document ${status === 'verified' ? 'verified' : 'rejected'} successfully!`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.success("User removed");
  };

  const allDocuments = users.flatMap(u =>
    u.documents.map(d => ({ ...d, userName: u.name, userId: u.id }))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-600" />
          Admin Panel
        </h1>
        <p className="text-slate-500 mt-1">Manage users, content, and verifications</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'jobs', label: 'Jobs', icon: Briefcase },
          { id: 'schemes', label: 'Schemes', icon: FileText },
          { id: 'exams', label: 'Exams', icon: GraduationCap },
          { id: 'verify', label: 'Verification', icon: CheckCircle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-ugova-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
              { label: 'Jobs', value: stats.totalJobs, icon: Briefcase, color: 'bg-ugova-50 text-ugova-600' },
              { label: 'Schemes', value: stats.totalSchemes, icon: FileText, color: 'bg-green-50 text-green-600' },
              { label: 'Exams', value: stats.totalExams, icon: GraduationCap, color: 'bg-purple-50 text-purple-600' },
              { label: 'Pending Verifications', value: stats.pendingVerifications, icon: Clock, color: 'bg-amber-50 text-amber-600' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-5"
              >
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Recent Users</h3>
              <div className="space-y-3">
                {users.slice(0, 5).map(u => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-ugova-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-ugova-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      u.role === 'admin' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Pending Verifications</h3>
              <div className="space-y-3">
                {allDocuments.filter(d => d.status === 'pending').length === 0 ? (
                  <p className="text-sm text-slate-400">No pending documents</p>
                ) : (
                  allDocuments.filter(d => d.status === 'pending').slice(0, 5).map(d => (
                    <div key={d.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{d.type}</p>
                        <p className="text-xs text-slate-500">By: {d.userName}</p>
                      </div>
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">All Users</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-ugova-500 outline-none text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Name</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Email</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Role</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Education</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Location</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">{u.name}</td>
                    <td className="px-5 py-3 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        u.role === 'admin' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{u.education || '-'}</td>
                    <td className="px-5 py-3 text-slate-500">{u.location || '-'}</td>
                    <td className="px-5 py-3">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Jobs */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Manage Jobs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Title</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Organization</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Category</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Location</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Last Date</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockJobs.map(job => (
                  <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">{job.title}</td>
                    <td className="px-5 py-3 text-slate-500">{job.organization}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-ugova-50 text-ugova-700 rounded text-xs">
                        {job.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{job.location}</td>
                    <td className="px-5 py-3 text-slate-500">{job.lastDate}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        job.status === 'active' ? 'bg-green-50 text-green-700' :
                        job.status === 'closed' ? 'bg-red-50 text-red-700' :
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schemes */}
      {activeTab === 'schemes' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Manage Schemes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Title</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Ministry</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Category</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Benefit</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockSchemes.map(scheme => (
                  <tr key={scheme.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">{scheme.title}</td>
                    <td className="px-5 py-3 text-slate-500">{scheme.ministry}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                        {scheme.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{scheme.benefit}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">
                        {scheme.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Exams */}
      {activeTab === 'exams' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Manage Exams</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Title</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Organization</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Exam Date</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Last Date</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockExams.map(exam => (
                  <tr key={exam.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">{exam.title}</td>
                    <td className="px-5 py-3 text-slate-500">{exam.organization}</td>
                    <td className="px-5 py-3 text-slate-500">{exam.examDate}</td>
                    <td className="px-5 py-3 text-slate-500">{exam.lastDate}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        exam.status === 'upcoming' ? 'bg-purple-50 text-purple-700' :
                        exam.status === 'ongoing' ? 'bg-green-50 text-green-700' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verification */}
      {activeTab === 'verify' && (
        <div className="space-y-4">
          {allDocuments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
              <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No documents uploaded yet</p>
            </div>
          ) : (
            allDocuments.map(doc => (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      doc.status === 'verified' ? 'bg-green-100' :
                      doc.status === 'rejected' ? 'bg-red-100' : 'bg-amber-100'
                    }`}>
                      <FileText className={`w-6 h-6 ${
                        doc.status === 'verified' ? 'text-green-600' :
                        doc.status === 'rejected' ? 'text-red-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{doc.type}</h4>
                      <p className="text-sm text-slate-500">By: {doc.userName}</p>
                      <p className="text-xs text-slate-400">Uploaded: {doc.uploadedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      doc.status === 'verified' ? 'bg-green-50 text-green-700' :
                      doc.status === 'rejected' ? 'bg-red-50 text-red-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {doc.status === 'verified' && <CheckCircle className="w-4 h-4" />}
                      {doc.status === 'rejected' && <XCircle className="w-4 h-4" />}
                      {doc.status === 'pending' && <Clock className="w-4 h-4" />}
                      {doc.status}
                    </span>
                    {doc.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerifyDocument(doc.userId, doc.id, 'verified')}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" /> Verify
                        </button>
                        <button
                          onClick={() => handleVerifyDocument(doc.userId, doc.id, 'rejected')}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
