import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import UploadPdf from "./Upload";
import ViewPdf from "./ViewPdf";
import ViewPdfRaw from "./ViewPdfRaw";
import AllBooks from "./AllBooks";
import "./App.css"; // Import your raw CSS file
import { EmbedPdf } from ".";

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
