const express = require('express');
const viewController = require('./../controllers/viewController');
const pollController = require('./../controllers/pollController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', 
    authController.isLoggedIn, 
    viewController.getOverview
);

router.get('/introduction', 
    authController.isLoggedIn, 
    viewController.getIntroduction
);

router.get('/powerplant', 
    authController.isLoggedIn, 
    viewController.getPowerplant
);

router.get('/polls', 
    authController.isLoggedIn, 
    viewController.getPolls
);

router.get('/createPoll', authController.isLoggedIn, viewController.getPollForm);

router.get('/polls', 
    authController.isLoggedIn, 
    viewController.getPolls
);

router.get('/polls/:id',authController.protect, authController.isLoggedIn, viewController.getPoll);

router.get('/login', authController.isLoggedIn, viewController.getLoginForm);

router.get('/signUp', authController.isLoggedIn, viewController.getSignupForm);

router.get('/me', authController.protect, viewController.getAccount);


module.exports = router;
