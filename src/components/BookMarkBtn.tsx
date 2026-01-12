
import { BookmarkCheck, BookmarkPlus } from "lucide-react";

interface BookMarkBtnProps {
    toggleBookmark: () => void;
    isBookmarked: boolean;
}

function BookMarkBtn({ toggleBookmark, isBookmarked }: BookMarkBtnProps) {
    return (
        <button
            onClick={toggleBookmark}
            className=""
        >
            {
                isBookmarked ?
                    <BookmarkCheck size={18} className="text-slate-400 hover:text-white" /> :
                    <BookmarkPlus size={18} className="text-slate-400 hover:text-white" />
            }
        </button>
    )
}

export default BookMarkBtn