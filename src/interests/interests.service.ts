import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InterestsRepository } from './interests.repository';
import { Interest } from './entities/interest.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private readonly interestsRepository: typeof InterestsRepository,
    private readonly logger: Logger) {}

    // Consulter tous les centres d'intérêt
    async findAll(): Promise<Interest[]> {
      return this.interestsRepository.find();
    }
}