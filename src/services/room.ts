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

  async getRoomById(roomId: number): Promise<ServiceResult<Room>> {
    return await this.roomRepository.getRoomById(roomId);
  }

  async createRoom(name: string): Promise<ServiceResult<Room>> {
    return await this.roomRepository.createRoom(name);
  }

  async deleteRoom(roomId: number): Promise<ServiceResult<null>> {
    return await this.roomRepository.deleteRoom(roomId);
  }

  async updateRoom(roomId: number, name: string): Promise<ServiceResult<Room>> {
    return await this.roomRepository.updateRoom(roomId, name);
  }

  async getSeats(filters?: GetSeatsFilters): Promise<ServiceResult<Seat[]>> {
    return await this.roomRepository.getSeats(filters);
  }

  async getSeatById(seatId: number): Promise<ServiceResult<Seat>> {
    return await this.roomRepository.getSeatById(seatId);
  }

  async createSeat(data: CreateSeatData): Promise<ServiceResult<Seat>> {
    return await this.roomRepository.createSeat(data);
  }

  async deleteSeat(seatId: number): Promise<ServiceResult<null>> {
    return await this.roomRepository.deleteSeat(seatId);
  }

  async updateSeat(
    seatId: number,
    data: UpdateSeatData,
  ): Promise<ServiceResult<Seat>> {
    return await this.roomRepository.updateSeat(seatId, data);
  }
}
