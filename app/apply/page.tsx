"use client";

import { Suspense } from "react";
import ApplyPageContent from "./ApplyPageContent";

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-ugova-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <ApplyPageContent />
    </Suspense>
  );
}
