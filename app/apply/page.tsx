"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  FileText,
  Briefcase,
  GraduationCap,
  Shield,
  Loader2,
} from "lucide-react";
import { mockJobs, mockSchemes, mockExams, getCurrentUser, Application } from "@/lib/mockData";
import { sendApplicationEmail } from "@/lib/mailService";

export default function ApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isApplying, setIsApplying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const type = searchParams.get("type") as 'job' | 'scheme' | 'exam';
  const id = searchParams.get("id");

  let item: Job | Scheme | Exam | undefined;
  let orgName = '';
  let applyLink = '#';
  let lastDate = '';

  if (type === 'job') {
    const found = mockJobs.find(j => j.id === id);
    if (found) {
      item = found;
      orgName = found.organization;
      applyLink = found.applyLink;
      lastDate = found.lastDate;
    }
  } else if (type === 'scheme') {
    const found = mockSchemes.find(s => s.id === id);
    if (found) {
      item = found;
      orgName = found.ministry;
      applyLink = found.applyLink;
      lastDate = found.lastDate;
    }
  } else if (type === 'exam') {
    const found = mockExams.find(e => e.id === id);
    if (found) {
      item = found;
      orgName = found.organization;
      applyLink = found.applyLink;
      lastDate = found.lastDate;
    }
  }

  useEffect(() => {
    if (!item) {
      toast.error("Invalid application");
    }
  }, [item]);

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Opportunity not found</p>
          <Link href="/" className="text-ugova-600 text-sm mt-2 inline-block hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const handleApply = async () => {
    setIsApplying(true);
    const user = getCurrentUser();

    if (!user) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    // Save application
    const applications: Application[] = JSON.parse(
      localStorage.getItem('ugova_applications') || '[]'
    );

    const newApp: Application = {
      id: `app-${Date.now()}`,
      userId: user.id,
      type,
      itemId: item.id,
      title: item.title,
      organization: orgName,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'applied',
      lastDate,
    };

    applications.push(newApp);
    localStorage.setItem('ugova_applications', JSON.stringify(applications));

    // Track in type-specific storage
    const key = `ugova_applied_${type}s`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(item.id);
    localStorage.setItem(key, JSON.stringify(existing));

    // Send email
    await sendApplicationEmail(
      user.email,
      user.name,
      item.title,
      orgName,
      type,
      lastDate,
      applyLink
    );

    setIsComplete(true);
    setIsApplying(false);
    toast.success("Application saved successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={type === 'job' ? '/jobs' : type === 'scheme' ? '/schemes' : '/exams'}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-ugova-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        {!isComplete ? (
          <>
            <div className="text-center mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                type === 'job' ? 'bg-ugova-50' :
                type === 'scheme' ? 'bg-green-50' : 'bg-purple-50'
              }`}>
                {type === 'job' && <Briefcase className="w-8 h-8 text-ugova-600" />}
                {type === 'scheme' && <FileText className="w-8 h-8 text-green-600" />}
                {type === 'exam' && <GraduationCap className="w-8 h-8 text-purple-600" />}
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Apply for {item.title}</h1>
              <p className="text-slate-500 mt-1">{orgName}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-2">Application Flow</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-ugova-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                    <span className="text-sm text-slate-600">Save to your UGOVA dashboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-ugova-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-sm text-slate-600">Receive confirmation email</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-ugova-600 text-white flex items-center justify-center text-xs font-bold">3</div>
                    <span className="text-sm text-slate-600">Redirect to official government website</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-600 text-white flex items-center justify-center text-xs font-bold">4</div>
                    <span className="text-sm text-slate-600">Complete application on official portal</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Important Notice</p>
                    <p className="mt-1">
                      UGOVA is an assistant platform. We do not process applications directly.
                      You will be redirected to the official government website to complete your application.
                      Last date: <span className="font-medium">{lastDate}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="w-full bg-ugova-600 text-white py-3 rounded-xl font-medium hover:bg-ugova-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Application...
                  </>
                ) : (
                  <>
                    Save to Dashboard & Apply <ExternalLink className="w-5 h-5" />
                  </>
                )}
              </button>
              <Link
                href={applyLink}
                target="_blank"
                className="w-full bg-white text-slate-700 py-3 rounded-xl font-medium border border-slate-200 hover:bg-slate-50 transition-colors text-center flex items-center justify-center gap-2"
              >
                Skip & Go to Official Site <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Saved!</h2>
            <p className="text-slate-500 mb-6">
              {item.title} has been saved to your dashboard. A confirmation email has been sent.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-ugova-600 text-white rounded-xl font-medium hover:bg-ugova-700 transition-colors"
              >
                View Dashboard
              </Link>
              <Link
                href={applyLink}
                target="_blank"
                className="px-6 py-2.5 bg-white text-slate-700 rounded-xl font-medium border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                Go to Official Site <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
