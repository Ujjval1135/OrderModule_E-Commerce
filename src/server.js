import { config } from "dotenv";
import sequelize from "./utils/dbConfig/db.Config.js";
import { resolve, dirname } from 'path';

// Load env file
config({
    path: resolve(dirname(
        import.meta.url), '../.env')
});

// Load App

import app from './app.js'

const PORT = process.env.PORT || 3030;

(async () => {
    try {
        await sequelize.authenticate();

        console.log('\x1b[33mDB Connection has been established successfully\x1b[0m');

        const server = app.listen(PORT, () => {
            console.log(`\x1b[33mServer is running on ${PORT} \x1b[0m`);

        })

        // Close the server after 5 seconds
        // setTimeout(() => {
        //     server.close(() => {
        //         console.log('Server has been closed');
        //     });
        // }, 5000);

    } catch (error) {
        console.log('Unable to connect to the server \n', error);

        process.exit(1);
    }
})();