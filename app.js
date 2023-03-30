const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

// Error handlers
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Backend Routing with Express
const userRouter = require('./routes/userRoutes');
const pollRouter = require('./routes/pollRoutes');

// Front End Rendering with Pug
const viewRouter = require('./routes/viewRoutes');

const app = express();  

app.enable('trust proxy')

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));



// Global Middleware

// Implementing cors
app.use(cors());
app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());
// Access-Control-Allow-Origin *

app.use(express.static(path.join(__dirname, '/public')));

// Data Security
app.use(helmet());

// app.use(
//     helmet.contentSecurityPolicy({
//       directives: {
//         defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
//         baseUri: ["'self'"],
//         fontSrc: ["'self'", 'https:','http:', 'data:'],
//         scriptSrc: [
//           "'self'",
//           'https:',
//           'http:',
//           'blob:'],
//         styleSrc: ["'self'", 'https:', 'http:','unsafe-inline']
//       }
//     })
//   );

// app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// Error Handling
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60* 1000,
    message: 'You have exceeded the amount of requests allowed, please try again in one hour' 
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '10kb'
}));
app.use(express.urlencoded({
    extended: true,
    limit: '10kb'
}))
app.use(cookieParser());

// Data Sanitization against no sql query injection
app.use(mongoSanitize());

// Data sanitization against cross site scripting attacks CXX
app.use(xss());

// Protect against http parameter pollution
// Only params that match the strings in the whitelist will be accepted as valid
// Fill whitelist array with strings representing the parameter names

app.use(hpp({
    whiteList: [
        'name',
        'email',
        'password',
        'passwordConfirm'
    ]
}));

app.use(compression());

//Serving static files

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//Routes 
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/polls', pollRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;