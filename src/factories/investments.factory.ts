import { setSeederFactory } from "typeorm-extension";
import { Investment } from "../investments/entities/investment.entity";
import { faker } from '@faker-js/faker';

export default setSeederFactory(Investment, () => {
    const investment = new Investment();
    investment.amount = faker.number.int({ min: 100, max: 10000 });
    investment.date = faker.date.recent();
    return investment;
});