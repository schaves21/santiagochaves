import {promises as fs} from "fs";
import { nanoid } from "nanoid";
import productmanager from "./productmanager.js"

const products = new productmanager();

class cart {

    constructor(){
        this.path = "./src/data/carts.json";
    }

    readCarts = async () => {

		let carts = await fs.readFile(this.path, "utf-8");
		return JSON.parse(carts);

	}

	writeCart = async (cart) => {

		await fs.writeFile(this.path, JSON.stringify(cart));

	}

    addCart = async () => {

        let currentCarts = await this.readCarts();
        let id = nanoid();
        let newCarts = [{ cartId: id, products: [] }, ...currentCarts];
        await this.writeCart(newCarts);
        return "Cart add";

    }

    existCart = async (id) => {

		let carts = await this.readCarts();
		return carts.find(cart => cart.cartId === id);

	}

    getCartById = async(id) => {

		let cartById = await this.existCart(id);

		if(!cartById){
			return "Cart not found";
		}else{
			return cartById;
		}

	}

    addProductCart = async(cartId, productId) => {

        let cartById = await this.existCart(cartId);
		if(!cartById) return "Cart not found"

        let productById = await products.existProduct(productId);
        if(!productById) return "Product not found"

        let cartsAll = await this.readCarts();
        let filterCart = cartsAll.filter(cart => cart.cartId != cartId); 

        if(cartById.products.some((prod) => prod.productId === productId)){

            let productInCart = cartById.products.find((prod) => prod.productId === productId);
            productInCart.quantity++; 
            let cartsProducts = [cartById, ...filterCart];
            await this.writeCart(cartsProducts);
            return "Quantity of product increased";

        } 

        cartById.products.push({ productId: productById.id, quantity: 1 });

        let otherCartProduct = [cartById, ...filterCart];
        await this.writeCart(otherCartProduct);
        return "Product added to cart";

    }

}

export default cart;