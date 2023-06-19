import { productModel } from "../dao/models/products.model.js";

class ProductService {
  validate(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category ||
      !thumbnail
    ) {
      console.log("Validation error: please complete all fields.");
      throw new Error("Validation error: please complete all fields.");
    }
  }

  async get(queryParams) {
    const { limit = 10, page = 1, sort, query } = queryParams;
    const filter = {};

    if (query) {
      filter.$or = [{ category: query }, { availability: query }];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === "desc" ? "-price" : "price",
    };

    const result = await productModel.paginate(filter, options);

    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}`
        : null,
    };
    return response;
  }

  async createOne(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    this.validate(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    );
    const productCreated = await productModel.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });
    return productCreated;
  }

  async updateOne(
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    this.validate(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    );
    const productUptaded = await productModel.updateOne(
      { _id: id },
      { title, description, code, price, status, stock, category, thumbnail }
    );
    return productUptaded;
  }

  async deleteOne(_id) {
    const productDeleted = await productModel.deleteOne({ _id });
    if (productDeleted.deletedCount === 1) {
      return true;
    } else {
      throw new Error("Product not found");
    }
  }
}

export const productService = new ProductService();
