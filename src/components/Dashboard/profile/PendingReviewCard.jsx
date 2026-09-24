import { FiClock } from 'react-icons/fi';

export default function PendingReviewCard() {
    return (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <FiClock className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">Your profile updates are under review</h3>
            <p className="mt-1 text-sm text-slate-500">
                Our team is reviewing the changes you submitted. You'll be notified once they're approved.
            </p>
        </div>
    );
}