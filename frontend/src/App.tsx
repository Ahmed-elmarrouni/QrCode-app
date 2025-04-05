import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import ScanPage from "./pages/ScanPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/scan" element={<ScanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
