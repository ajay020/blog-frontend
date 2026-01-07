import { useEffect, useRef } from "react";


const useInfiniteScroll = ({ onLoadMore, hasMore, isLoading }) => {
    const observer = useRef(null);
    const targetRef = useRef(null);

    useEffect(() => {
        if (isLoading) return;
        if (!hasMore) return;

        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onLoadMore();
                }
            },
            { threshold: 1 }
        );

        if (targetRef.current) {
            observer.current.observe(targetRef.current);
        }

        return () => observer.current?.disconnect();
    }, [onLoadMore, hasMore, isLoading]);

    return targetRef;
};

export default useInfiniteScroll;
