import { Router } from 'express';
import OrderController from './OrderController.js';


const router = Router();

router.get('/', (req, res) => [
    res.status(200).send("ok it's working ORDER")
]);

router.get('/orderList', OrderController.get);

router.get('/find/:id', OrderController.getOneOrder);

router.post('/add-cart', OrderController.add_Cart);

router.post('/place-order', OrderController.place_order);

router.put('/cart/update/:id', OrderController.update_Cart);

router.delete('/cart/delete/:id', OrderController.deleteCart)

router.delete('/cart/product/delete/:id', OrderController.deleteCartProduct)

router.delete('/delete/:id', OrderController.deleteOrder)

export default router;