import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow">
            <div className="flex items-center gap-6">
                <span
                    className="font-bold text-lg cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    📋 Board Meeting Minutes
                </span>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-sm text-blue-100 hover:text-white transition"
                >
                    Dashboard
                </button>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-blue-100">
                    {user?.username} {user?.role && `(${user.role})`}
                </span>
                <button
                    onClick={logout}
                    className="bg-white text-blue-700 text-sm px-3 py-1 rounded-lg hover:bg-blue-50 transition font-medium"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}