import { useNavigate } from "react-router-dom";
import "./App.css"; // import the CSS file
import image1 from './assets/image1.png';
import image2 from './assets/image2.png';
import image3 from './assets/image3.png';

const books = [
    {
      id: 1,
      IsNewReader: false,
      image: image1,
      editionName: "Company Law Ready Reckoner",
      authors: [{ name: "Taxmann's Editorial Board" }],
      avgRating: 4.3,
      key: 'pdfs/1756810225845_encrypted_pdf1.pdf.enc'
    },
    {
      id: 2,
      IsNewReader: true,
      image: image2,
      editionName: "Forensic Audit Decoded – Unlocking the Secrets of Forensic Accounting Investigation",
      authors: [{ name: "Gyan B. Pipara" }],
      avgRating: 5,
      key: 'pdfs/1756810469470_encrypted_pdf2.pdf.enc'
    },
    {
      id: 3,
      IsNewReader: true,
      image: image3,
      editionName: "Mutual Fund Foundation",
      authors: [{ name: "National Institute of Securities Markets | An Educational Initiative of SEBI" }],
      avgRating: 5,
      key: 'pdfs/1756810480515_encrypted_pdf3.pdf.enc'
    }
  ];
  
const AllBooks = () => {
  const navigate = useNavigate();
  const handleNavigation = (key) => {
    navigate("/view", { state: { key } });
  };

  return (
    <div style={{display:"flex"}}>
    {books.map((book)=>{
        return (
            <div className="book-card" onClick={()=>handleNavigation(book.key)} key={book.key}>
            {/* Reader Tag */}
            <div className="reader-tag">
            📖 {book.IsNewReader ? "New" : "Old"} Reader
            </div>

            {/* Image */}
            <div className="book-image-wrapper">
            <img
                src={book.image || "/placeholder-book.png"}
                alt={book.editionName}
                className="book-image"
            />
            </div>

            {/* Book Info */}
            <div className="book-info">
            <p className="book-title">{book.editionName}</p>
            <p className="book-authors">
                By{" "}
                {book.authors && book.authors.length > 0
                ? book.authors.map((a, i) =>
                    i === book.authors.length - 1 ? a.name : `${a.name}, `
                    )
                : "Unknown Author"}
            </p>

            {book.avgRating && (
                <div className="book-rating">
                <span>★</span>
                <span className="rating-value">{book.avgRating} Rating</span>
                </div>
            )}
            </div>
            </div>
        )
    })}
    </div>
  );
};

export default AllBooks;
