"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Building2,
  Calendar,
  Search,
  Filter,
  ExternalLink,
  Target,
  Sparkles,
  ChevronDown,
  DollarSign,
  BookOpen,
} from "lucide-react";
import { mockExams, getCurrentUser, Application } from "@/lib/mockData";
import { checkEligibility, predictSuccess } from "@/lib/aiService";
import { sendApplicationEmail } from "@/lib/mailService";

export default function ExamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEligibility, setShowEligibility] = useState<string | null>(null);
  const [showPrediction, setShowPrediction] = useState<string | null>(null);
  const [appliedExams, setAppliedExams] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('ugova_applied_exams') || '[]');
    }
    return [];
  });

  const user = getCurrentUser();
  const statuses = ["all", "upcoming", "ongoing", "closed"];

  const filteredExams = useMemo(() => {
    return mockExams.filter(exam => {
      const matchesSearch =
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.organization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const handleApply = async (exam: typeof mockExams[0]) => {
    if (!user) {
      toast.error("Please login to track this exam");
      return;
    }

    const newApplied = [...appliedExams, exam.id];
    setAppliedExams(newApplied);
    localStorage.setItem('ugova_applied_exams', JSON.stringify(newApplied));

    const applications: Application[] = JSON.parse(
      localStorage.getItem('ugova_applications') || '[]'
    );
    applications.push({
      id: `app-${Date.now()}`,
      userId: user.id,
      type: 'exam',
      itemId: exam.id,
      title: exam.title,
      organization: exam.organization,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'applied',
      lastDate: exam.lastDate,
    });
    localStorage.setItem('ugova_applications', JSON.stringify(applications));

    await sendApplicationEmail(
      user.email, user.name, exam.title, exam.organization,
      'Exam', exam.lastDate, exam.applyLink
    );

    toast.success("Added to dashboard! Redirecting to official site...");
    setTimeout(() => {
      window.open(exam.applyLink, '_blank');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-purple-600" />
          Competitive Exams
        </h1>
        <p className="text-slate-500 mt-1">
          Track upcoming UPSC, SSC, Banking, Railway, and state-level exams
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exams, organizations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 outline-none bg-white"
          >
            {statuses.map(s => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredExams.map((exam, i) => {
          const isApplied = appliedExams.includes(exam.id);
          const eligibility = checkEligibility(user, exam);
          const prediction = predictSuccess(user, exam);

          return (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{exam.title}</h3>
                      <p className="text-purple-600 font-medium">{exam.organization}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      exam.status === 'upcoming' ? 'bg-purple-50 text-purple-700' :
                      exam.status === 'ongoing' ? 'bg-green-50 text-green-700' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {exam.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      {exam.organization}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Exam: {exam.examDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Last Date: {exam.lastDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      {exam.fee}
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-slate-600 flex items-start gap-1.5">
                    <BookOpen className="w-4 h-4 mt-0.5 shrink-0" />
                    <span><span className="font-medium">Syllabus:</span> {exam.syllabus}</span>
                  </div>

                  <div className="text-sm text-slate-500 mt-2">
                    <span className="font-medium">Eligibility:</span> {exam.eligibility}
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:min-w-[180px]">
                  {isApplied ? (
                    <span className="px-4 py-2.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium text-center">
                      Tracked
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(exam)}
                      className="px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      Track Exam <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowEligibility(showEligibility === exam.id ? null : exam.id)}
                    className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Target className="w-4 h-4" />
                    Check Eligibility
                    <ChevronDown className={`w-3 h-3 transition-transform ${showEligibility === exam.id ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={() => setShowPrediction(showPrediction === exam.id ? null : exam.id)}
                    className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Prediction
                    <ChevronDown className={`w-3 h-3 transition-transform ${showPrediction === exam.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {showEligibility === exam.id && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-3">Eligibility Analysis</h4>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      eligibility.status === 'eligible' ? 'bg-green-500' :
                      eligibility.status === 'partially-eligible' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {eligibility.score}%
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        eligibility.status === 'eligible' ? 'text-green-700' :
                        eligibility.status === 'partially-eligible' ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {eligibility.status === 'eligible' ? 'You are Eligible!' :
                         eligibility.status === 'partially-eligible' ? 'Partially Eligible' : 'Not Eligible'}
                      </p>
                      <p className="text-sm text-slate-500">Based on your profile</p>
                    </div>
                  </div>
                  {eligibility.reasons.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-green-700">Matched Criteria:</p>
                      <ul className="text-sm text-slate-600 list-disc list-inside">
                        {eligibility.reasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}
                  {eligibility.missing.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-600">Missing:</p>
                      <ul className="text-sm text-slate-600 list-disc list-inside">
                        {eligibility.missing.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {showPrediction === exam.id && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Success Prediction
                  </h4>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-purple-300 flex items-center justify-center">
                      <span className="text-xl font-bold text-purple-700">{prediction.probability}%</span>
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        prediction.probability >= 75 ? 'text-green-600' :
                        prediction.probability >= 45 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {prediction.recommendation === 'apply' ? 'Strong Recommendation: Register!' :
                         prediction.recommendation === 'try-later' ? 'Consider Registering' : 'Not Recommended'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {prediction.tips.map((tip, i) => (
                      <p key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">•</span>
                        {tip}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-16">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No exams found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
