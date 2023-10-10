import fs from 'fs';

class CartManager {
    constructor() {
        this.path = "../data/carts.json";
        this.carts = this.loadCarts();
        this.cartId = this.generateCartId();
    }

    loadCarts() {
        if (fs.existsSync(this.path)) {
            const readJSON = fs.readFileSync(this.path, "utf-8");
            return JSON.parse(readJSON);
        }
        return [];
    }

    saveCarts() {
        const stringifyCarts = JSON.stringify(this.carts);
        fs.writeFileSync(this.path, stringifyCarts);
    }

    generateCartId() {
        if (this.carts.length === 0) {
            return 1;
        }
        const maxId = Math.max(...this.carts.map(cart => cart.id));
        return maxId + 1;
    }

    getCart() {
        return this.carts;
    }

    addCart() {
        const newCart = {
            id: this.cartId++,
            products: [],
        };

        this.carts.push(newCart);
        this.saveCarts();
    }

    addProduct(idCartToAdd, idProductToAdd) {
        const cartSearched = this.carts.find(cart => cart.id === idCartToAdd);

        if (cartSearched) {
            const productLocation = cartSearched.products.findIndex(product => product.id === idProductToAdd);

            if (productLocation === -1) {
                const newProduct = {
                    id: idProductToAdd,
                    quantity: 1,
                };

                cartSearched.products.push(newProduct);
            } else {
                cartSearched.products[productLocation].quantity++;
            }

            this.saveCarts();
        } else {
            throw new Error("Cart not found");
        }
    }

    seeProducts(cartId) {
        const cartSearched = this.carts.find(cart => cart.id === cartId);

        if (cartSearched) {
            return cartSearched.products;
        } else {
            throw new Error("Cart not found");
        }
    }
}

export default CartManager;
