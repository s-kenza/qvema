import { setSeederFactory } from "typeorm-extension";
import { Project } from "../projects/entities/project.entity";
import { faker } from '@faker-js/faker';

export default setSeederFactory(Project, () => {
    const project = new Project();
    project.title = faker.commerce.productName();
    project.description = faker.lorem.paragraph();
    project.budget = parseFloat(faker.commerce.price());
    project.category = faker.commerce.department();
    project.ownerId = ''; // Sera défini dans le seeder
    return project;
})