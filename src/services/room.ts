import type {
  CreateSeatData,
  GetRoomsFilters,
  GetSeatsFilters,
  Room,
  RoomRepository,
  RoomService,
  Seat,
  ServiceResult,
  UpdateSeatData,
} from "../types/rooms.types.js";

export class DefaultRoomService implements RoomService {
  private readonly roomRepository: RoomRepository;

  constructor(roomRepository: RoomRepository) {
    this.roomRepository = roomRepository;
  }

  async getRooms(filters?: GetRoomsFilters): Promise<ServiceResult<Room[]>> {
    return await this.roomRepository.getRooms(filters);
  }

  async getRoomById(id: number): Promise<ServiceResult<Room>> {
    return await this.roomRepository.getRoomById(id);
  }

  async createRoom(name: string): Promise<ServiceResult<Room>> {
    return await this.roomRepository.createRoom(name);
  }

  async deleteRoom(id: number): Promise<ServiceResult<null>> {
    return await this.roomRepository.deleteRoom(id);
  }

  async updateRoom(id: number, name: string): Promise<ServiceResult<Room>> {
    return await this.roomRepository.updateRoom(id, name);
  }

  async getSeats(filters?: GetSeatsFilters): Promise<ServiceResult<Seat[]>> {
    return await this.roomRepository.getSeats(filters);
  }

  async getSeatById(id: number): Promise<ServiceResult<Seat>> {
    return await this.roomRepository.getSeatById(id);
  }

  async createSeat(data: CreateSeatData): Promise<ServiceResult<Seat>> {
    return await this.roomRepository.createSeat(data);
  }

  async deleteSeat(id: number): Promise<ServiceResult<null>> {
    return await this.roomRepository.deleteSeat(id);
  }

  async updateSeat(
    id: number,
    data: UpdateSeatData,
  ): Promise<ServiceResult<Seat>> {
    return await this.roomRepository.updateSeat(id, data);
  }
}
