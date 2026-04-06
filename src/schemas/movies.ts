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

  private filtersSchema = z.object({
    genreIds: z
      .array(z.string())
      .transform((arr) => arr.map(Number))
      .optional(),
    search: z.string().optional(),
    limit: z
      .string()
      .transform((val) => parseInt(val))
      .optional(),
    offset: z
      .string()
      .transform((val) => parseInt(val))
      .optional(),
  });

  async validateFilters(data: unknown) {
    return this.filtersSchema.safeParse(data);
  }

  async validatePartialFilters(data: unknown) {
    return this.filtersSchema.partial().safeParse(data);
  }

  private createMovieSchema = z.object({
    ...this.baseMovieSchema.omit({ genres: true }).shape,
    genreIds: z.array(z.number()).min(1, "At least one genre ID is required"),
  });

  async validateCreate(data: unknown) {
    return this.createMovieSchema.safeParse(data);
  }

  async validatePartialCreate(data: unknown) {
    return this.createMovieSchema.partial().safeParse(data);
  }
}
