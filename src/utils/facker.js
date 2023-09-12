import { faker } from '@faker-js/faker';

faker.locale = 'es';

export const generateProduct = () => {
  return {
    _id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.random.alphaNumeric(10),
    price: faker.commerce.price(),
    status: faker.datatype.boolean(),
    stock: faker.random.numeric(3),
    category: faker.word.noun(),
    thumbnail: faker.image.imageUrl(),
    owner: faker.internet.email(),
  };
};
