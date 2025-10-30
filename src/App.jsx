import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import UploadPdf from "./Upload";
import ViewPdf from "./ViewPdf";
import ViewPdfRaw from "./ViewPdfRaw";
import AllBooks from "./AllBooks";
import "./App.css"; // Import your raw CSS file
import { EmbedPdf } from ".";
(function debuggerTrapRedirect() {
  const PAUSE_THRESHOLD_MS = 100; 
  const INTERVAL_MS = 1000;    

  setInterval(() => {
    const t0 = performance.now();
    debugger;
    const t1 = performance.now();

    if (t1 - t0 > PAUSE_THRESHOLD_MS) {
      try {
        window.location.href = 'https://www.google.com';
      } catch (err) {
        window.open('https://www.google.com', '_self');
      }
    }
  }, INTERVAL_MS);
})();

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo-container">
        <img
          src="https://d3lzbbhyvqc4k.cloudfront.net/images-webp/main-logo.webp"
          alt="Logo"
          className="logo"
        />
        <span className="title">Taxmann Virtual Books</span>
      </div>
      <div className="button-container">
        <button
          onClick={() => navigate("/")}
          className="view-books-button"
        >
          View all books
        </button>
      </div>
    </header>
  );
};

const App = () => {
  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<EmbedPdf />} />
        <Route path="/view" element={<ViewPdf />} />
        <Route path="/view-raw" element={<ViewPdfRaw />} />
        <Route path="/upload" element={<UploadPdf />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
