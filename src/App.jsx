import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UploadPdf from "./Upload";
import ViewPdf from "./ViewPdf";
import ViewPdfRaw from "./ViewPdfRaw";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPdf />} />
        <Route path="/view" element={<ViewPdf />} />
        <Route path='/view-raw' element={<ViewPdfRaw/>}/>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
