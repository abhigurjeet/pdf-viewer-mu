import React, { useState, useEffect } from "react";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export default function UploadPdf() {
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const bucketName = import.meta.env.VITE_AWS_BUCKET;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadPdf = async () => {
    if (!file) return alert("Please select a PDF first!");
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
      const encrypted = CryptoJS.AES.encrypt(wordArray, import.meta.env.VITE_AES_SECRET_KEY).toString();

      const params = {
        Bucket: bucketName,
        Key: `pdfs/${Date.now()}_${file.name}.enc`,
        Body: encrypted,
      };

      await s3.send(new PutObjectCommand(params));
      alert("PDF encrypted & uploaded!");
      fetchDocs();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocs = async () => {
    try {
      const params = { Bucket: bucketName, Prefix: "pdfs/" };
      const res = await s3.send(new ListObjectsV2Command(params));
      setDocs(res.Contents || []);
    } catch (err) {
      console.error("List error:", err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleView = (key) => {
    navigate("/view", { state: { key } });
  };

  const handleViewRaw = (key) => {
    navigate("/view-raw", { state: { key } });
  };

  return (
    <div className="container">
      <h2 className="heading">PDF Manager</h2>

      <div className="upload-section">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button onClick={uploadPdf} disabled={loading} className="upload-button">
          {loading ? "Uploading..." : "Upload & Encrypt"}
        </button>
      </div>

      <h3 className="subheading">Uploaded Docs:</h3>
      <ul className="doc-list">
        {docs.map((doc, idx) => (
          <li key={idx} className="doc-item">
            <span className="doc-key">{doc.Key}</span>
            <div className="doc-actions">
              <button onClick={() => handleView(doc.Key)} className="view-button">
                View
              </button>
              {/* <button onClick={() => handleViewRaw(doc.Key)} className="view-raw-button">
                View Raw
              </button> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
