import { setSeederFactory } from "typeorm-extension";
import { User } from "../users/entities/user.entity";
import { faker } from '@faker-js/faker';

export default setSeederFactory(User, () => {
    const user = new User();
    user.name = faker.person.fullName();
    user.email = faker.internet.email();
    user.password = faker.internet.password({ length: 10 });
    return user;
})