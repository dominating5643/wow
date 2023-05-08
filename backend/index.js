const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth_router');
const poductRouter = require('./routers/product_router');
const paymentRouter = require('./routers/payment_router');
const adminRouter = require('./routers/admin_router');


const PORT = 3000;
const app = express();
app.use(express.json());

app.use(cookieParser());

app.use('/api', authRouter);
app.use('/api', poductRouter);
app.use('/api', paymentRouter);
app.use('/api', adminRouter);

function start() {
    try {
        app.listen(PORT, () => console.log('Server start on ' + PORT + ' port'));
    } catch (error) {
        console.log('Error:' + error);
    }
}
start();