import { ApiResponse } from "@/types/api.types";
import { rtkApi } from "./rtkApi";
import { Article } from "@/types/article.types";

export const articleApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        getArticles: builder.query({
            query: () => "/articles",
        }),

        getArticle: builder.query<ApiResponse<Article>, string>({
            query: (slug: string) => `/articles/${slug}`,
        }),
    }),
});

export const {
    useGetArticlesQuery,
    useGetArticleQuery,
} = articleApi;