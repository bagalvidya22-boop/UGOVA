import { Suspense } from "react";
import ApplyContent from "./apply-content";

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-ugova-600 border-t-transparent rounded-full" />
      </div>
    }>
      <ApplyContent />
    </Suspense>
  );
}
