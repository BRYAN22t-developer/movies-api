import type {
  CreateReservationData,
  Reservation,
  ReservationFiltersData,
  ReservationRepository,
  ReservationService,
  ServiceResult,
  updateReservationData,
} from "../types/reservation.types.js";

export class DefaultReservationService implements ReservationService {
  private repository: ReservationRepository;
  constructor(repository: ReservationRepository) {
    this.repository = repository;
  }
  async getReservationStateById(
    id: number,
  ): Promise<ServiceResult<{ id: number; state: string }>> {
    return await this.repository.getReservationStateById(id);
  }

  async getReservations(
    filters?: ReservationFiltersData,
  ): Promise<ServiceResult<Reservation[]>> {
    return await this.repository.getReservations(filters);
  }

  async getReservationById(id: number): Promise<ServiceResult<Reservation>> {
    return await this.repository.getReservationById(id);
  }

  async createReservation(
    data: CreateReservationData,
  ): Promise<ServiceResult<Reservation>> {
    const result = await this.repository.createReservation(data);

    if (!result.ok) {
      if (result.error === "SEAT_ALREADY_RESERVED") {
        return {
          ok: false,
          error: "Seat already reserved",
        };
      }

      return result;
    }

    return result;
  }

  async updateReservation(
    id: number,
    data: updateReservationData,
  ): Promise<ServiceResult<Reservation>> {
    return await this.repository.updateReservation(id, data);
  }

  async deleteReservation(id: number): Promise<ServiceResult<null>> {
    return await this.repository.deleteReservation(id);
  }

  async getReservationStates(): Promise<
    ServiceResult<{ id: number; state: string }[]>
  > {
    return await this.repository.getReservationStates();
  }

  async createReservationState(
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>> {
    return await this.repository.createReservationState(state);
  }

  async deleteReservationState(id: number): Promise<ServiceResult<null>> {
    return await this.repository.deleteReservationState(id);
  }

  async updateReservationState(
    id: number,
    state: string,
  ): Promise<ServiceResult<{ id: number; state: string }>> {
    return await this.repository.updateReservationState(id, state);
  }
}
