"use client";

import Link from "next/link";
import { Shield, Mail, MapPin, Phone, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-ugova-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">UGOVA</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-powered Government Opportunities & Verification App. Your personal assistant for jobs, schemes, and exams.
            </p>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>bagalmukesh6@gmail.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Government Jobs</Link></li>
              <li><Link href="/schemes" className="hover:text-white transition-colors">Welfare Schemes</Link></li>
              <li><Link href="/exams" className="hover:text-white transition-colors">Competitive Exams</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">AI Eligibility Checker</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Success Predictor</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Resume Parser</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Deadline Reminders</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Document Verification</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <span>India - AI Government Opportunity Platform</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Support via Dashboard</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>bagalmukesh6@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2024 UGOVA. All rights reserved. Inspired by National Portal of India.
          </p>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500" /> for Indian Citizens
          </p>
        </div>
      </div>
    </footer>
  );
}
