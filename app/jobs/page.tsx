"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Target,
  Sparkles,
} from "lucide-react";
import { mockJobs, getCurrentUser, Application } from "@/lib/mockData";
import { checkEligibility, predictSuccess } from "@/lib/aiService";
import { sendApplicationEmail } from "@/lib/mailService";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showEligibility, setShowEligibility] = useState<string | null>(null);
  const [showPrediction, setShowPrediction] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('ugova_applied_jobs') || '[]');
    }
    return [];
  });

  const user = getCurrentUser();
  const categories = ["all", ...Array.from(new Set(mockJobs.map(j => j.category)))];

  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const handleApply = async (job: typeof mockJobs[0]) => {
    if (!user) {
      toast.error("Please login to apply");
      return;
    }

    const newApplied = [...appliedJobs, job.id];
    setAppliedJobs(newApplied);
    localStorage.setItem('ugova_applied_jobs', JSON.stringify(newApplied));

    // Save application
    const applications: Application[] = JSON.parse(
      localStorage.getItem('ugova_applications') || '[]'
    );
    applications.push({
      id: `app-${Date.now()}`,
      userId: user.id,
      type: 'job',
      itemId: job.id,
      title: job.title,
      organization: job.organization,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'applied',
      lastDate: job.lastDate,
    });
    localStorage.setItem('ugova_applications', JSON.stringify(applications));

    // Send email
    await sendApplicationEmail(
      user.email,
      user.name,
      job.title,
      job.organization,
      'Job',
      job.lastDate,
      job.applyLink
    );

    toast.success("Application saved! Redirecting to official site...");
    setTimeout(() => {
      window.open(job.applyLink, '_blank');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-ugova-600" />
          Government Jobs
        </h1>
        <p className="text-slate-500 mt-1">
          Browse {mockJobs.length}+ central and state government job openings
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, organizations, locations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-ugova-500 focus:ring-2 focus:ring-ugova-200 outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 focus:border-ugova-500 outline-none bg-white"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {filteredJobs.map((job, i) => {
          const isApplied = appliedJobs.includes(job.id);
          const eligibility = checkEligibility(user, job);
          const prediction = predictSuccess(user, job);

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-ugova-600 font-medium">{job.organization}</p>
                    </div>
                    <span className="px-3 py-1 bg-ugova-50 text-ugova-700 text-sm font-medium rounded-full">
                      {job.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Last Date: {job.lastDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {job.type}
                    </span>
                  </div>

                  <p className="text-slate-600 mt-3 text-sm leading-relaxed">{job.description}</p>

                  <div className="text-sm text-slate-500 mt-2">
                    <span className="font-medium">Eligibility:</span> {job.eligibility}
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:min-w-[180px]">
                  {isApplied ? (
                    <span className="px-4 py-2.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium text-center">
                      Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job)}
                      className="px-4 py-2.5 bg-ugova-600 text-white rounded-lg text-sm font-medium hover:bg-ugova-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      Apply Now <ExternalLink className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setShowEligibility(showEligibility === job.id ? null : job.id)}
                    className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Target className="w-4 h-4" />
                    Check Eligibility
                    <ChevronDown className={`w-3 h-3 transition-transform ${showEligibility === job.id ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    onClick={() => setShowPrediction(showPrediction === job.id ? null : job.id)}
                    className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Prediction
                    <ChevronDown className={`w-3 h-3 transition-transform ${showPrediction === job.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Eligibility Panel */}
              {showEligibility === job.id && (
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

              {/* Prediction Panel */}
              {showPrediction === job.id && (
                <div className="mt-4 p-4 bg-ugova-50 rounded-lg border border-ugova-200">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-ugova-600" />
                    AI Success Prediction
                  </h4>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-ugova-300 flex items-center justify-center">
                      <span className="text-xl font-bold text-ugova-700">{prediction.probability}%</span>
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        prediction.probability >= 75 ? 'text-green-600' :
                        prediction.probability >= 45 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {prediction.recommendation === 'apply' ? 'Strong Recommendation: Apply!' :
                         prediction.recommendation === 'try-later' ? 'Consider Applying' : 'Not Recommended'}
                      </p>
                      <div className="flex gap-4 text-sm text-slate-500 mt-1">
                        <span>Competition: {prediction.factors.competition}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Tips:</p>
                    {prediction.tips.map((tip, i) => (
                      <p key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-ugova-500 mt-0.5">•</span>
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

      {filteredJobs.length === 0 && (
        <div className="text-center py-16">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No jobs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
