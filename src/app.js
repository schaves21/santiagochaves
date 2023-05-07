
import express from "express";
import ProductManager from "./components/ProductManager.js";

const app = express();
app.use(express.urlencoded({ extended:true }));
const PORT = 8080;

const productManager = new ProductManager();

const allProducts = productManager.readProducts();

app.get("/products", async (req, res) => {

    let limit = parseInt(req.query.limit);

    if(!limit) {
        return res.send(await allProducts);
    }  

    let readProduct = await allProducts;
    let productLimit = readProduct.slice(0, limit); 
    res.send(productLimit);
});

app.get("/products/:pid", async (req, res) => {

    let id = parseInt(req.params.pid);
    let readProduct = await allProducts;

    let productFilterId = readProduct.find(product => product.id === id);

    if(productFilterId){
        res.send(productFilterId);  
    }else{
        return res.send( { msg: "Product not exist" });
    }
    
});

const localHost = app.listen(PORT, () => {

    console.log(`Servidor local con express en el puerto ${ localHost.address().port }`);

});
