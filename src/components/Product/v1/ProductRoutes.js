import { Router } from 'express';
import { ProductModel } from '../model/index.js';
import ProductController from './ProductController.js';
import validations from './ProductValidation.js';


const router = Router();

router.get('/', (req, res) => [
    res.status(200).send("ok it's working Prouct API")
]);

router.get('/ProductList', ProductController.get);

router.get('/find/:id', ProductController.getOneProduct);

router.get('/categories', ProductController.getcategories);

router.get('/categories/:category', ProductController.getcategory);

router.get('/categories/:category/:brand', ProductController.getcategorybrand);

router.post('/add_Products', ProductController.add);

router.put('/update/:id', [validations.update], ProductController.updateOneProduct);

router.patch('/updates/:id', ProductController.updateOneProducts);

router.delete('/detele/:id', ProductController.deleteProduct)

export default router;