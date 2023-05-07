
import {promises as fs} from "fs";


export default class ProductManager {

	constructor() {

		this.path = "./products.json";

	}

	readProducts = async () => {

		let result = await fs.readFile(this.path, "utf-8");	
		return JSON.parse(result);

	}

}

	