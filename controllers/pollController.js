const multer = require('multer');
const sharp = require('sharp');
const Poll = require('./../models/pollModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const ModelValidator = require('./../utils/modelValidator');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadPollPhoto = upload.single('photo');

exports.resizePollPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `poll-${req.poll.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/polls/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.createPoll = catchAsync(async(req, res, next) => {
    req.body.answers.forEach( (answer, i) => {
        if(!req.body.answers[i].hasOwnProperty("answer")) return next(new AppError('each object in answers needs to have an answers property', 404));
    });

    let answers = []
    req.body.answers.map( answer => {
      if(!answer.answer == '') return answers.push({answer: answer.answer, votes: 0, voters: []})
    })

    console.log(answers)

    const poll = await Poll.create({
        topic: req.body.topic,
        createdBy: req.user._id,
        answers
    });

    res.status(200).json({
        status: 'success',
        poll
    });
})

exports.updatePoll = catchAsync(async(req, res, next) => {
    let user = await User.findById(req.user.id);
    let poll = await Poll.findById(req.params.id);  

    if(!user || !poll) return next(new AppError("Poll could not be updated", 404))

    const answers = poll.answers;
    const index = user.pollsVotedOn.findIndex(userPoll => ModelValidator.matchProperty(userPoll, poll, "id"));
    console.log(index)

    if(index == -1){
      console.log('pushing')
      user.pollsVotedOn.push({id: poll.id, vote: req.body.vote});
      answers[req.body.vote - 1].votes += 1;  
    }
    else {
      let vote = user.pollsVotedOn[index].vote;
      user.pollsVotedOn[index].vote = req.body.vote;
      answers[vote - 1].votes -= 1;
      answers[req.body.vote - 1].votes +=1;
    }

    console.log(user.pollsVotedOn)
    
    poll.answers = answers;

    const updatedUser = await User.findByIdAndUpdate(user.id, user);
    const updatedPoll = await Poll.findByIdAndUpdate(poll.id, poll);

    res.status(200).json({
      status: 'success',
      data: {
        updatedPoll,
        updatedUser
      }
    });
});


exports.getPoll = factory.getOne(Poll);
exports.getAllPolls = factory.getAll(Poll);
// Do NOT update passwords with this!
exports.deletePoll = factory.deleteOne(Poll);