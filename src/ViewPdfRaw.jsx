import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initMuPDFWebViewer } from "mupdf-webviewer";
import "./App.css";

const ViewPdfRaw = () => {
  const location = useLocation();
  const { key = "secured2025new.pdf" } = location.state || {};
  useEffect(() => {
    if (!key) return;

    const openRaw = async () => {
      try {
        const url = `https://${import.meta.env.VITE_AWS_BUCKET}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
        await initMuPDFWebViewer("#viewer-raw", url, {
          libraryPath: "/lib",
          licenseKey:import.meta.env.VITE_MU_ACCESS_KEY_ID
        });
      } catch (err) {
        console.error("Opening raw PDF failed:", err);
      }
    };

    openRaw();
  }, [key]);

  return <div id="viewer-raw" className="pdf-viewer"></div>;
};

export default ViewPdfRaw;
