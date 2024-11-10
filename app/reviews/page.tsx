import { Metadata } from "next";
import dynamic from 'next/dynamic';

const ContentGrid = dynamic(() => import("@/components/dashboard/content-grid"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "Reviews - StreamTracker",
  description: "Your content reviews and ratings",
};

export default function ReviewsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reviews</h1>
        <p className="text-gray-500">Your ratings and reviews</p>
      </div>
      <ContentGrid filter="rated" />
    </div>
  );
}