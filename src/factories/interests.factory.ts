import { setSeederFactory } from "typeorm-extension";
import { Interest } from "../interests/entities/interest.entity";
import { faker } from '@faker-js/faker';

export default setSeederFactory(Interest, () => {
    const interest = new Interest();
    interest.name = faker.commerce.department();
    return interest;
});