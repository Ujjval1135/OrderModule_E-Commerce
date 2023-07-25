import express from 'express';
import router from './routes/index.js';
import middleware from './middleware/index.js';
import path from 'path';

const app = express();

app.locals.baseURL = 'http://localhost:3030';

app.use(express.static('./'));

middleware(app); //bind Middleware
router(app); //All mian Router


// app.all('/*', (req, res) => {
//     console.error('Invalid Route Handler',
//         'No UUID',
//         'Invalid Route Fired : ' + req.path, {});
//     return res.status(400).json({
//         status: 400,
//         message: 'Bad Request',
//     });
// });

export default app;