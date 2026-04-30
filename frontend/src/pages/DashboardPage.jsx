import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { getStats } from "../services/meetingsService";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getStats()
            .then((res) => setStats(res.data))
            .catch(() => setError("Failed to load dashboard stats."))
            .finally(() => setLoading(false));
    }, []);

    const kpiCards = stats ? [
        {
            label: "Total Meetings",
            value: stats.totalMeetings ?? 0,
            color: "bg-blue-700",
            icon: "📋",
        },
        {
            label: "Published",
            value: stats.publishedCount ?? 0,
            color: "bg-green-600",
            icon: "✅",
        },
        {
            label: "Drafts",
            value: stats.draftCount ?? 0,
            color: "bg-yellow-500",
            icon: "📝",
        },
        {
            label: "Archived",
            value: stats.archivedCount ?? 0,
            color: "bg-gray-500",
            icon: "🗄️",
        },
    ] : [];

    const chartData = stats ? [
        { name: "Published", count: stats.publishedCount ?? 0 },
        { name: "Draft", count: stats.draftCount ?? 0 },
        { name: "Archived", count: stats.archivedCount ?? 0 },
    ] : [];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-blue-700 hover:underline"
                    >
                        ← Back to Meetings
                    </button>
                </div>

                {loading && <LoadingSpinner />}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {!loading && stats && (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {kpiCards.map((card) => (
                                <div
                                    key={card.label}
                                    className={`${card.color} text-white rounded-xl p-5 shadow`}
                                >
                                    <div className="text-3xl mb-2">{card.icon}</div>
                                    <div className="text-3xl font-bold">{card.value}</div>
                                    <div className="text-sm mt-1 opacity-90">{card.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Chart */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                Meetings by Status
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Recent Activity */}
                        {stats.recentMeetings && stats.recentMeetings.length > 0 && (
                            <div className="bg-white rounded-xl shadow p-6 mt-6">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                    Recent Meetings
                                </h2>
                                <ul className="divide-y divide-gray-100">
                                    {stats.recentMeetings.map((m) => (
                                        <li
                                            key={m.id}
                                            className="py-3 flex justify-between items-center"
                                        >
                                            <span className="text-sm text-gray-800 font-medium">
                                                {m.title}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${m.status === "PUBLISHED"
                                                    ? "bg-green-100 text-green-700"
                                                    : m.status === "DRAFT"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}>
                                                {m.status}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}