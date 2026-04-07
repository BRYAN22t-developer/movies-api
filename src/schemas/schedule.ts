import z from "zod";

export class ScheduleSchema {
  private baseScheduleSchema = z.object({
    movieId: z.number().int().positive("Movie ID must be a positive integer"),
    roomId: z.number().int().positive("Room ID must be a positive integer"),
    stateId: z.number().int().positive("State ID must be a positive integer"),
    title: z.string().min(1, "Title is required"),
    startTime: z.string().min(1, "Start time is required"),
    startDate: z.string().min(1, "Start date is required"),
  });

  validateSchedule(data: unknown) {
    return this.baseScheduleSchema.safeParse(data);
  }

  validatePartialSchedule(data: unknown) {
    return this.baseScheduleSchema.partial().safeParse(data);
  }

  private ScheduleFilterSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  });

  validateScheduleFilters(data: unknown) {
    return this.ScheduleFilterSchema.safeParse(data);
  }
}
