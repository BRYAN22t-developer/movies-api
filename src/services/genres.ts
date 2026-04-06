import type {
  GenresService,
  GenresRepository,
  CreateGenreData,
  Genre,
  ServiceResult,
  UpdateGenreData,
} from "../types/movies.types.js";

export class DefaultGenresService implements GenresService {
  private readonly genresRepository: GenresRepository;
  constructor(genresRepository: GenresRepository) {
    this.genresRepository = genresRepository;
  }
  getGenres(): Promise<ServiceResult<Genre[]>> {
    return this.genresRepository.getGenres();
  }
  createGenre(data: CreateGenreData): Promise<ServiceResult<Genre>> {
    return this.genresRepository.create(data);
  }
  findGenreById(id: number): Promise<ServiceResult<Genre | null>> {
    return this.genresRepository.findById(id);
  }
  findGenreByIds(ids: number[]): Promise<ServiceResult<Genre[] | null>> {
    return this.genresRepository.findByIds(ids);
  }
  findGenreByName(name: string): Promise<ServiceResult<Genre | null>> {
    return this.genresRepository.findByName(name);
  }
  deleteGenreById(id: number): Promise<ServiceResult<null>> {
    return this.genresRepository.deleteById(id);
  }
  updateGenreById(
    id: number,
    data: UpdateGenreData,
  ): Promise<ServiceResult<Genre>> {
    return this.genresRepository.updateById(id, data);
  }
}
