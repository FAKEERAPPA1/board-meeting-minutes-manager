import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMeetingById, deleteMeeting } from "../services/meetingsService";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import AiPanel from "../components/AiPanel";


const STATUS_STYLES = {
    PUBLISHED: "bg-green-100 text-green-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
    ARCHIVED: "bg-gray-100 text-gray-600",
};

// Score badge — shown if AI gives a score
function ScoreBadge({ score }) {
    if (score == null) return null;
    const color =
        score >= 8 ? "bg-green-100 text-green-700" :
            score >= 5 ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-600";
    return (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${color}`}>
            AI Score: {score}/10
        </span>
    );
}

export default function MeetingDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getMeetingById(id)
            .then((res) => setMeeting(res.data))
            .catch(() => setError("Meeting not found or failed to load."))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this meeting?")) return;
        try {
            await deleteMeeting(id);
            navigate("/");
        } catch {
            setError("Failed to delete. Please try again.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <LoadingSpinner />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 text-blue-600 hover:underline text-sm"
                >
                    ← Back to list
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto p-6">

                {/* Back */}
                <button
                    onClick={() => navigate("/")}
                    className="text-sm text-blue-600 hover:underline mb-4 inline-block"
                >
                    ← Back to list
                </button>

                <div className="bg-white rounded-xl shadow p-8">

                    {/* Title + Status */}
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">{meeting.title}</h1>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[meeting.status] || "bg-gray-100 text-gray-600"}`}>
                                {meeting.status}
                            </span>
                            <ScoreBadge score={meeting.aiScore} />
                        </div>
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                        <div>
                            <span className="font-medium text-gray-700">Meeting Date: </span>
                            {meeting.meetingDate
                                ? new Date(meeting.meetingDate).toLocaleDateString()
                                : "—"}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Location: </span>
                            {meeting.location || "—"}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Created By: </span>
                            {meeting.createdBy || "—"}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Created At: </span>
                            {meeting.createdAt
                                ? new Date(meeting.createdAt).toLocaleDateString()
                                : "—"}
                        </div>
                    </div>

                    {/* Attendees */}
                    {meeting.attendees && (
                        <div className="mb-5">
                            <h2 className="text-sm font-semibold text-gray-700 mb-1">Attendees</h2>
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
                                {meeting.attendees}
                            </p>
                        </div>
                    )}

                    {/* Agenda */}
                    {meeting.agenda && (
                        <div className="mb-5">
                            <h2 className="text-sm font-semibold text-gray-700 mb-1">Agenda</h2>
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3 whitespace-pre-wrap">
                                {meeting.agenda}
                            </p>
                        </div>
                    )}

                    {/* Minutes */}
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-1">Minutes</h2>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3 whitespace-pre-wrap">
                            {meeting.minutesText || "—"}
                        </p>
                    </div>

                    {/* AI Description — shown if backend already has one saved */}
                    {meeting.aiDescription && (
                        <div className="mb-5 border-l-4 border-blue-400 pl-4">
                            <h2 className="text-sm font-semibold text-blue-700 mb-1">
                                🤖 AI Description
                            </h2>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                {meeting.aiDescription}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-8 pt-6 border-t">
                        <button
                            onClick={() => navigate(`/meetings/${id}/edit`)}
                            className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition text-sm font-medium"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
                        >
                            Cancel
                        </button>
                    </div>

                </div>

                {/* ✅ AI Panel — rendered below the meeting card */}
                <AiPanel
                    meetingId={meeting.id}
                    minutesText={meeting.minutesText}
                />

            </div>
        </div>
    );
}