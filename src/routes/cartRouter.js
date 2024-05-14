import { Router } from "express";
import cartModel from "../models/cart.js";


const cartRouter = Router()

cartRouter.post('/', async (req, res) => {
    try {
        const mensaje = await cartModel.create({ products: [] })
        res.status(201).send(mensaje)
    } catch (e) {
        res.status(500).send(`Error interno del servidor al crear carrito: ${error}`)
    }
})

cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({ _id: cartId }).populate("products.id_prod")
        res.status(200).send(cart)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`)
    }
})

cartRouter.post('/:cid/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const { quantity } = req.body
        
        if (quantity === undefined){
            quantity = 1;
        }


        const updatedCart = await cartModel.findOneAndUpdate(
            {_id: cartId, "products.id_prod": productId},
        {$inc: {"products.$.quantity": quantity}},
        {new: true}
        );

        if(!updatedCart){
            const cart = await cartModel.findByIdAndUpdate(
                cartId,
                { $push: { products: {id_prod: productId, quantity }}},
            {new: true}
            );
            res.status(200).send(cart);
        } else{
            res.status(200).send(updatedCart);
        }

    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        
        const updatedCart = await cartModel.findOneAndDelete(
            { _id: cartId},
            { $pull: {products: {id_prod: productId}}},
            {new: true}
        );

            if(!updatedCart){
                res.status(200).send(updatedCart);
            }else{
                res.status(404).send("Carrito no encontrado");
            }

    } catch (error) {
        res.status(500).send(`Error interno al borrar el producto del carrito: ${error}`)
    }});

cartRouter.put("/:cid", async (rec, res) => {
    try {
        const cartId = req.params.cid;
        const newProducts = req.body;
        const updatedCart = await cartModel.findByIdAndUpdate(
            { _id: cartId},
            { $set: {products: newProducts}},
            {new: true}
        );
        if(!updatedCart){
            return res.status(404).send("Carrito no encontrado");
        }
        res.status(200).send(updatedCart);
    } catch (error) {
        res.status(500).send(`Error interno al borrar el producto del carrito: ${error}`)  
    }});

    cartRouter.put("/:cid/products/:pid", async (rec, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const { quantity } = req.body;

            if (isNaN(quantity) || quantity < 0){
                return re.status(404).send("Cantidad invalida");
            }

            const updatedCart = await cartModel.findByIdAndUpdate(
                { _id: cartId, "products.id_prod": productId},
                { $set: {"products.$.quantity": quantity}},
                {new: true}
            );

            if(!updatedCart){
                return res.status(404).send("Carrito o producto no encontrados");
            }
            res.status(200).send(updatedCart);
        } catch (error) {
            res.status(500).send(`Error interno: ${error}`)  
        }});

cartRouter.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;

        const updatedCart = await cartModel.findOneAndDelete(
            cartId,
            { products: []},
            {new: true}
        );

            if(!updatedCart){
                return res.status(404).send("Carrito no encontrado");
                            
                } return res.status(202).send("Carrito borrado");

    } catch (error) {
        res.status(500).send(`Error interno: ${error}`)
    }});


export default cartRouter