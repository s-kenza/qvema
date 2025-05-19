  // src/interests/interests.repository.ts
  import { AppDataSource } from '../config/datasource';
  import { Interest } from './entities/interest.entity';
  import { Repository } from 'typeorm';

  export const InterestsRepository = AppDataSource.getRepository(Interest).extend({
    findById(this: Repository<Interest>, uuid: string) {
      return this.createQueryBuilder('interest')
        .where('interest.uuid = :uuid', { uuid })
        .getOne();
    }
  });