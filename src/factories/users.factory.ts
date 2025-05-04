import { setSeederFactory } from "typeorm-extension";
import { User } from "../users/entities/user.entity";
import { faker } from '@faker-js/faker';

export default setSeederFactory(User, () => {
    const user = new User();
    user.email = faker.internet.email();
    user.password = faker.internet.password({ length: 10 });
    user.firstname = faker.person.firstName();
    user.lastname = faker.person.lastName();
    user.role = faker.helpers.arrayElement(['entrepreneur', 'investor', 'admin']);
    user.createdAt = faker.date.recent();
    return user;
})