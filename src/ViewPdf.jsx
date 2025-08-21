import { initMuPDFWebViewer } from "mupdf-webviewer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import CryptoJS from "crypto-js";


const ViewPdf = () => {
  const location = useLocation();
  const { key } = location.state || {};

  useEffect(() => {
    if (!key) return;
  
    const fetchAndDecrypt = async () => {
      const url = `https://${import.meta.env.VITE_AWS_BUCKET}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
      const res = await fetch(url);
      const encryptedText = await res.text();
      const decrypted = CryptoJS.AES.decrypt(encryptedText,import.meta.env.VITE_AES_SECRET_KEY);
      const typedArray = new Uint8Array(
        decrypted.words.map((w) => [
          (w >> 24) & 0xff,
          (w >> 16) & 0xff,
          (w >> 8) & 0xff,
          w & 0xff,
        ]).flat()
      );

      const blob = new Blob([typedArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
  
      initMuPDFWebViewer("#viewer", blobUrl, {
        libraryPath: "/lib",
        licenseKey:import.meta.env.VITE_MU_ACCESS_KEY_ID      
      });
    };
  
    fetchAndDecrypt().catch(console.error);
  }, [key]);
  

  return <div id="viewer" className="pdf-viewer"></div>;
};

export default ViewPdf;
