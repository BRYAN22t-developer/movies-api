import { z } from "zod";

export class MovieSchema {
  private baseMovieSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    poster_url: z.url("Poster URL must be a valid URL"),
    duration_minutes: z
      .number()
      .int()
      .positive("Duration must be a positive integer"),
    genres: z.array(z.string()).min(1, "At least one genre is required"),
  });

  async validateMovie(data: unknown) {
    return this.baseMovieSchema.safeParse(data);
  }

  async validatePartialMovie(data: unknown) {
    return this.baseMovieSchema.partial().safeParse(data);
  }
}
