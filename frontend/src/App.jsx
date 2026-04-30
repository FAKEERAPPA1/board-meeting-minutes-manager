import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MeetingListPage from "./pages/MeetingListPage";
import MeetingFormPage from "./pages/MeetingFormPage";
import MeetingDetailPage from "./pages/MeetingDetailPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

function EditWrapper() {
  const { id } = useParams();
  return <MeetingFormPage meetingId={id} />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute><MeetingListPage /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/meetings/new" element={
            <ProtectedRoute><MeetingFormPage /></ProtectedRoute>
          } />
          <Route path="/meetings/:id" element={
            <ProtectedRoute><MeetingDetailPage /></ProtectedRoute>
          } />
          <Route path="/meetings/:id/edit" element={
            <ProtectedRoute><EditWrapper /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;