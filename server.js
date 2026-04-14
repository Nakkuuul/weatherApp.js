import app from './src/app.js';
import env from './src/config/env.js'

app.listen(env.PORT, () => {
    console.log('Server is up and running on Port', env.PORT);
}); 