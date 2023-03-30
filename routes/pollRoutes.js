const express = require('express');
const pollController = require('./../controllers/pollController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.use(authController.restrictTo('user', 'admin'));

router
    .route(`/`)
    .get(pollController.getAllPolls)
    .post(pollController.createPoll)
;

router
    .route(`/:id`)
    .get(pollController.getPoll)
    .delete(pollController.deletePoll)
    .patch(pollController.updatePoll)
;   

module.exports = router;