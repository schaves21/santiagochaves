import { nanoid } from "nanoid";
import { promises as fs } from "fs";

class productManager {
  constructor() {
    this.path = "./src/data/products.json";
  }

  readProducts = async () => {
    let products = await fs.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };

  getProducts = async () => {
    return await this.readProducts();
  };

  writeProduct = async (product) => {
    await fs.writeFile(this.path, JSON.stringify(product));
  };

  addProduct = async (product) => {
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.status ||
      !product.stock ||
      !product.category
    ) {
      return "All fields are required, except for thumbnails";
    }

    let readProduct = await this.readProducts();

    const codeExist = readProduct.some((prod) => prod.code === product.code);

    if (codeExist) {
      return `There is a product with the same code: ${product.code}`;
    }

    product.id = nanoid();
    let arrayProducts = [...readProduct, product];
    await this.writeProduct(arrayProducts);
    return "Product add";
  };

  existProduct = async (id) => {
    let readProduct = await this.readProducts();
    return readProduct.find((prod) => prod.id === id);
  };

  getProductById = async (id) => {
    let productById = await this.existProduct(id);

    if (!productById) {
      return "Product not found";
    } else {
      return productById;
    }
  };

  updateProduct = async (id, putProduct) => {
    let productById = await this.existProduct(id);

    if (!productById) {
      return "Product update not found";
    } else {
      let readProduct = await this.readProducts();

      let findProductIndex = readProduct.findIndex(
        (product) => product.id === id
      );
      if (findProductIndex !== -1) {
        let updatedProduct = {
          ...readProduct[findProductIndex],
          ...putProduct,
        };
        readProduct[findProductIndex] = updatedProduct;
        await this.writeProduct(readProduct);
        return "Update product";
      } else {
        return "Product update not found";
      }
    }
  };

  deleteProduct = async (id) => {
    let readProduct = await this.readProducts();

    let findProduct = readProduct.some((prod) => prod.id === id);

    if (findProduct) {
      let filterArrayProducts = readProduct.filter((prod) => prod.id != id);
      await this.writeProduct(filterArrayProducts);
      return "Product delete";
    } else {
      return "Product delete not exist";
    }
  };
}

export default productManager;
