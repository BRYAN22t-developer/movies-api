import { z } from "zod";

export class MovieSchema {
    constructor(
        private readonly getGenres: () => Promise<string[]>
    ) {}

    private baseMovieSchema = z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        poster_url: z.url("Poster URL must be a valid URL"),
        duration_minutes: z.number().int().positive("Duration must be a positive integer"),
        genres: z.array(z.string()).min(1, "At least one genre is required")
    });

    async validateMovie(data: unknown) {
        const baseResult = this.baseMovieSchema.safeParse(data);

        if (!baseResult.success) {
            return baseResult;
        }

        const allowedGenres = await this.getGenres();

        if (!allowedGenres.length) {
            throw new Error("getGenres must return at least one genre");
        }

        const invalidGenres = baseResult.data.genres.filter(
            (genre) => !allowedGenres.includes(genre)
        );

        if (invalidGenres.length > 0) {
            return {
                success: false as const,
                error: {
                    issues: invalidGenres.map((genre) => ({
                        code: "custom",
                        path: ["genres"],
                        message: `Invalid genre: ${genre}`
                    }))
                }
            };
        }

        return baseResult;
    }

    async validatePartialMovie(data: unknown){
        const baseResult = this.baseMovieSchema.partial().safeParse(data)

        if (!baseResult.success) {
            return baseResult;
        }

        const allowedGenres = await this.getGenres();

        if (!allowedGenres.length) {
            throw new Error("getGenres must return at least one genre");
        }

        if(!baseResult?.data?.genres){
            return baseResult
        }

        const invalidGenres =  baseResult.data.genres.filter(
            (genre) => !allowedGenres.includes(genre)
        );

        if (invalidGenres.length > 0) {
            return {
                success: false as const,
                error: {
                    issues: invalidGenres.map((genre) => ({
                        code: "custom",
                        path: ["genres"],
                        message: `Invalid genre: ${genre}`
                    }))
                }
            };
        }

        return baseResult;
    }
}