import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import MeetingListPage from "./pages/MeetingListPage";
import MeetingFormPage from "./pages/MeetingFormPage";

function EditWrapper() {
  const { id } = useParams();
  return <MeetingFormPage meetingId={id} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MeetingListPage />} />
        <Route path="/meetings/new" element={<MeetingFormPage />} />
        <Route path="/meetings/:id/edit" element={<EditWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import MeetingListPage from "./pages/MeetingListPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <MeetingListPage />
    </div>
  );
}