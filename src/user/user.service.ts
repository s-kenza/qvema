import { Injectable } from '@nestjs/common';

const users = [
  {
    id: 1,
    firstName: 'Kenza',
    lastName: 'Schuler',
    email: 'kenza.schuler@gmail.com',
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.fr',
  },
];

@Injectable()
export class UserService {
  findAll() {
    return users;
  }

  findOne(id: number) {
    const user = users.find((user) => user.id === id);
    if (!user) {
      return 'User not found';
    }

    return user;
  }
}
