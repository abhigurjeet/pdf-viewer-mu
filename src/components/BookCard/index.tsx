import { useNavigate } from "react-router-dom";

interface Author {
  name: string;
}

interface Book {
  editionId: string;
  editionName: string;
  image?: string;
  authors: Author[];
  avgRating?: number;
  IsNewReader?: boolean;
}

interface BookCardProps {
  book: Book;
  mode?: "offline" | "online";
}

const BookCard: React.FC<BookCardProps> = ({ book, mode }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    const path =
      mode === "offline" ? `/offlinebook/${book.editionId}` : `/book/${book.editionId}`;
    navigate(path);
  };

  return (
    <div
      className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition cursor-pointer relative"
      onClick={handleNavigation}
    >
      {/* Reader Tag */}
      <div className="absolute top-2 left-2 bg-gray-200 text-gray-700 px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 z-10">
        📖 {book.IsNewReader ? "New" : "Old"} Reader
      </div>

      {/* Image */}
      <div className="h-56 w-full flex justify-center items-center mb-4 overflow-hidden rounded-md bg-gray-100">
        <img
          src={book.image || "/placeholder-book.png"}
          alt={book.editionName}
          className="h-full object-contain"
        />
      </div>

      {/* Book Info */}
      <div>
        <p className="text-[#0a0a4d] font-semibold truncate">{book.editionName}</p>
        <p className="text-sm text-gray-500 truncate">
          By{" "}
          {book.authors && book.authors.length > 0
            ? book.authors.map((a, i) =>
                i === book.authors.length - 1 ? a.name : `${a.name}, `
              )
            : "Unknown Author"}
        </p>

        {book.avgRating && (
          <div className="flex items-center text-sm text-yellow-500 mt-1">
            <span>★</span>
            <span className="ml-1 text-gray-700">{book.avgRating} Rating</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;