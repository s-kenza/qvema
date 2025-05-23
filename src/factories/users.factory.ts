import { setSeederFactory } from "typeorm-extension";
import { User } from "../users/entities/user.entity";
import { faker } from '@faker-js/faker';
import { UserRole } from "src/enums/user-role.enum";
import * as bcrypt from 'bcrypt';

export default setSeederFactory(User, () => {
    const user = new User();
    user.email = faker.internet.email();
    user.password = bcrypt.hashSync(faker.internet.password(), 10);
    user.firstname = faker.person.firstName();
    user.lastname = faker.person.lastName();
    user.role = faker.helpers.arrayElement(Object.values(UserRole));
    user.createdAt = faker.date.recent();
    return user;
})