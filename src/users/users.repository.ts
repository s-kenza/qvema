  // src/users/user.repository.ts
  import { AppDataSource } from '../config/datasource';
  import { User } from './entities/user.entity';
  import { Repository } from 'typeorm';

  export const UsersRepository = AppDataSource.getRepository(User).extend({
    findByName(this: Repository<User>, firstName: string, lastName: string, role: string) {
      return this.createQueryBuilder('user')
        .where('user.firstName = :firstName', { firstName })
        .andWhere('user.lastName = :lastName', { lastName })
        .andWhere('user.role = :role', { role })
        .getMany();
    },

    findOneByEmail(this: Repository<User>, email: string) {
      return this.findOne({
        where: { email },
      });
    },

    remove(this: Repository<User>, user: User) {
      return this.createQueryBuilder('user')
        .delete()
        .from(User)
        .where('user.uuid = :uuid', { uuid: user.uuid })
        .execute();
    }
  });