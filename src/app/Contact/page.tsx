export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
            <h1 className="text-4xl font-extrabold text-slate-900">Contact Team Support</h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
                Have technical development inquiries regarding database configurations or API response pipelines? Reach out below.
            </p>
            <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm inline-block text-left max-w-sm w-full mx-auto">
                <p className="text-sm font-semibold text-slate-400">EMAIL CHANNELS</p>
                <p className="text-base text-indigo-600 font-medium mb-4">support@example.com</p>
                <p className="text-sm font-semibold text-slate-400">GLOBAL HEADQUARTERS</p>
                <p className="text-base text-slate-800 font-medium">Enterprise Web Systems Inc.</p>
            </div>
        </div>
    );
}