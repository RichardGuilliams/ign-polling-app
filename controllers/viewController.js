const User = require('../models/userModel');
const Poll = require('../models/pollModel');
const catchAsync = require('../utils/catchAsync');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'payment')
    res.locals.alert =
      "Your payment was successful! Please check your email for a confirmation.";
  next();
};

exports.getPollForm = (req, res, next) => {
  res.status(200).render('user/pollForm', {
    title: 'Create A Poll'  
  })
}

exports.getIntroduction = (req, res, next) => {
  res.status(200).render('introduction', {
    title: 'Developer Introduction'
  })
}

exports.getPowerplant = (req, res, next) => {
  res.status(200).render('powerplant', {
    title: 'Jubilife Village Powerplant'
  })
}

exports.getPolls = catchAsync(async(req, res, next) => {
  const polls = await Poll.find();

  res.status(200).render('polls', {
    title: 'IGN Polling App',
    polls
  })
})

exports.getPoll = catchAsync(async(req, res, next) => {
  const poll = await Poll.findById(req.params.id);

  res.status(200).render('user/poll', {
    title: `${poll.topic}`,
    poll
  })
})

exports.getOverview = catchAsync( async(req, res, next) => {
  res.status(200).render('overview', {
    title: 'Overview'
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('authentication/login', {
    title: 'Log into your account'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('authentication/signup', {
    title: 'Create an account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('user/account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('user/account', {
    title: 'Your account',
    user: updatedUser
  });
});