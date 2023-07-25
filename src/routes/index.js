import app from 'express';
import { CustomerRoutes } from '../components/Customer/v1/index.js';
import { ProductRoutes } from '../components/Product/v1/index.js';
import { OrderRouter } from '../components/Order/v1/index.js'


export default (app) => {
    app.use('/customer', CustomerRoutes);
    app.use('/products', ProductRoutes);
    app.use('/order', OrderRouter)
}

