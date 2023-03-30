const mongoose = require('mongoose');
const dotenv = require('dotenv');
const IOHandler = require('./io_handler.js')

process.on('uncaughtException', err => {
    console.log(err)
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION! Shutting Down...');
    process.exit(1);
});

dotenv.config({ path: `./config.env`});

const http = require('http');
const app = require('./app');

// Uncomment when database is ready to be connected
// Connect to database
const DB = process.env.DATABASE
.replace(`<PASSWORD>`, process.env.DATABASE_PASSWORD )
.replace(`<USER>`, process.env.USER);

mongoose
.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
.then(() => console.log(`DB connection successful`))
.catch(err => console.log(err));

// Define and listen to Port
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = require('socket.io')(server)

server.listen(port, () => {
    console.log(`Connected and listening on port ${port}`)
    IOHandler.connect(io);
});

// Log Unhandled Rejections
process.on('unhandledRejection', err => {
    console.log(err);
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! Shutting Down...');
    server.close(() => {
        process.exit(1);
    })
});

