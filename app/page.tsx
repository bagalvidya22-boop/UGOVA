"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  GraduationCap,
  Sparkles,
  Shield,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  Target,
  Award,
} from "lucide-react";
import { getCurrentUser } from "@/lib/mockData";
import { getAIRecommendations, AIRecommendation } from "@/lib/aiService";
import { mockJobs, mockSchemes, mockExams } from "@/lib/mockData";

export default function HomePage() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [stats, setStats] = useState({ jobs: 0, schemes: 0, exams: 0 });

  useEffect(() => {
    const user = getCurrentUser();
    const recs = getAIRecommendations(user, mockJobs, mockSchemes, mockExams);
    setRecommendations(recs.slice(0, 6));
    setStats({
      jobs: mockJobs.length,
      schemes: mockSchemes.length,
      exams: mockExams.length,
    });
  }, []);

  const features = [
    {
      icon: Briefcase,
      title: "Government Jobs",
      desc: "Browse 1000+ central & state government job openings with AI filtering.",
      href: "/jobs",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: FileText,
      title: "Schemes & Benefits",
      desc: "Discover welfare schemes, subsidies, and financial aid you qualify for.",
      href: "/schemes",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: GraduationCap,
      title: "Competitive Exams",
      desc: "Track upcoming UPSC, SSC, Railway, Banking and state-level exams.",
      href: "/exams",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const aiFeatures = [
    { icon: Sparkles, title: "AI Recommendations", desc: "Personalized opportunities based on your profile" },
    { icon: Target, title: "Eligibility Check", desc: "Instant verification if you qualify for any opening" },
    { icon: TrendingUp, title: "Success Prediction", desc: "AI-powered probability analysis for your applications" },
    { icon: Clock, title: "Deadline Tracking", desc: "Never miss an important date with smart reminders" },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ugova-900 via-ugova-800 to-ugova-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptMCAwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
                <Zap className="w-4 h-4 text-yellow-300" />
                AI-Powered Government Opportunities
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Your Personal{" "}
                <span className="text-ugova-300">Government</span>{" "}
                Opportunity Assistant
              </h1>
              <p className="text-lg text-ugova-100 mb-8 leading-relaxed max-w-xl">
                UGOVA uses AI to find the best government jobs, schemes, and exams
                tailored to your profile. Track applications, check eligibility, and
                never miss a deadline.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-ugova-800 rounded-xl font-semibold hover:bg-ugova-50 transition-colors"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  Explore Opportunities
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-ugova-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 space-y-4">
                  {recommendations.slice(0, 3).map((rec, i) => (
                    <div
                      key={i}
                      className="bg-white/10 rounded-xl p-4 border border-white/10 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-ugova-500/30 flex items-center justify-center">
                        {rec.type === 'job' && <Briefcase className="w-6 h-6 text-ugova-300" />}
                        {rec.type === 'scheme' && <FileText className="w-6 h-6 text-green-300" />}
                        {rec.type === 'exam' && <GraduationCap className="w-6 h-6 text-purple-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{rec.item.title}</h4>
                        <p className="text-sm text-ugova-200">{rec.reason}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-ugova-300">{rec.matchScore}%</div>
                        <div className="text-xs text-ugova-200">Match</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-ugova-700">{stats.jps}00+</div>
              <div className="text-sm text-slate-500 mt-1">Government Jobs</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-green-600">{stats.schemes}0+</div>
              <div className="text-sm text-slate-500 mt-1">Welfare Schemes</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-purple-600">{stats.exams}0+</div>
              <div className="text-sm text-slate-500 mt-1">Competitive Exams</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Explore Opportunities</h2>
            <p className="text-slate-500 mt-2">Three pillars of government opportunities</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={feature.href}
                  className="block bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-ugova-200 transition-all group"
                >
                  <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                  <div className="mt-5 flex items-center text-ugova-600 font-medium text-sm group-hover:gap-2 transition-all">
                    Browse All <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-ugova-50 rounded-full text-sm font-medium text-ugova-700 mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Intelligence
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Smart Matching That Understands You
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                UGOVA&apos;s AI engine analyzes your profile, skills, education, and preferences
                to deliver personalized recommendations with accuracy you can trust.
              </p>
              <div className="space-y-4">
                {aiFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-ugova-100 rounded-lg flex items-center justify-center shrink-0">
                      <feat.icon className="w-5 h-5 text-ugova-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{feat.title}</h4>
                      <p className="text-sm text-slate-500">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-ugova-100 to-blue-100 rounded-3xl blur-2xl opacity-50" />
              <div className="relative bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-ugova-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-ugova-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">AI Analysis</h3>
                    <p className="text-sm text-slate-500">Profile-based matching</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Education Match", value: 92, color: "bg-green-500" },
                    { label: "Age Criteria", value: 100, color: "bg-green-500" },
                    { label: "Category Benefit", value: 85, color: "bg-ugova-500" },
                    { label: "Location Match", value: 78, color: "bg-ugova-500" },
                    { label: "Skills Alignment", value: 65, color: "bg-yellow-500" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-medium text-slate-900">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.value}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.8 }}
                          className={`h-full ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
                  <Award className="w-5 h-5 text-green-600 shrink-0" />
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">84% Match Score</span> — This opportunity is highly recommended for your profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ugova-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Opportunity?
          </h2>
          <p className="text-ugova-200 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have discovered government jobs, schemes, and exams
            that match their profile using UGOVA&apos;s AI engine.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ugova-800 rounded-xl font-semibold hover:bg-ugova-50 transition-colors"
          >
            Start Your Journey <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
