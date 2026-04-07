import type {
  createScheduleData,
  Schedule,
  ScheduleFilterData,
  ScheduleRepository,
  ScheduleService,
  ServiceResult,
  updateScheduleData,
} from "../types/schedule.types.js";

export class DefaultScheduleService implements ScheduleService {
  private readonly scheduleRepository: ScheduleRepository;

  constructor(scheduleRepository: ScheduleRepository) {
    this.scheduleRepository = scheduleRepository;
  }

  async getSchedule(
    filters?: ScheduleFilterData,
  ): Promise<ServiceResult<Schedule[]>> {
    return await this.scheduleRepository.getSchedule(filters);
  }

  async getScheduleById(id: number): Promise<ServiceResult<Schedule>> {
    return await this.scheduleRepository.getScheduleById(id);
  }

  async createSchedule(
    data: createScheduleData,
  ): Promise<ServiceResult<Schedule>> {
    return await this.scheduleRepository.createSchedule(data);
  }

  async updateSchedule(
    id: number,
    data: updateScheduleData,
  ): Promise<ServiceResult<Schedule>> {
    return await this.scheduleRepository.updateSchedule(id, data);
  }

  async deleteSchedule(id: number): Promise<ServiceResult<null>> {
    return await this.scheduleRepository.deleteSchedule(id);
  }
}
