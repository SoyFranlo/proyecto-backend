import fs from 'fs';

class ProductManager {
    constructor() {
        this.path = "../data/products.json";
        this.products = this.loadProducts();
    }

    loadProducts() {
        if (fs.existsSync(this.path)) {
            const readJSON = fs.readFileSync(this.path, "utf-8");
            return JSON.parse(readJSON);
        }
        return [];
    }

    saveProducts(products) {
        const stringifyProducts = JSON.stringify(products);
        fs.writeFileSync(this.path, stringifyProducts);
    }

    addProduct(addedProduct) {
        const { products } = this;
        const addedProductCode = addedProduct.code;

        if (!products.some(p => p.code === addedProductCode)) {
            const newProduct = {
                id: this.products.length + 1,
                ...addedProduct,
            };

            products.push(newProduct);
            this.saveProducts(products);
        } else {
            throw new Error("This code is not eligible. Please try again");
        }
    }

    getProductById(searchedId) {
        const existingProduct = this.products.find((product) => product.id === searchedId);

        if (existingProduct) {
            console.warn("Product already exists");
            return existingProduct;
        } else {
            throw new Error("Product not found");
        }
    }

    updateProduct(productId, dataToUpdate) {
        const { products } = this;
        const location = products.findIndex((product) => product.id === productId);

        if (location === -1) {
            throw new Error("Product not found");
        }

        const updatedProduct = {
            id: productId,
            ...dataToUpdate,
        };

        products[location] = updatedProduct;
        this.saveProducts(products);
        console.log("Product data updated");
    }

    deleteProduct(productId) {
        const { products } = this;
        const location = products.findIndex((product) => product.id === productId);

        if (location !== -1) {
            products.splice(location, 1);
            this.saveProducts(products);
            console.log("Product deleted successfully");
        } else {
            throw new Error("Product not found");
        }
    }
}

export default ProductManager;
