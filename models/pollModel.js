const mongoose = require('mongoose');
const ModelValidator = require('../utils/modelValidator');

const pollSchema = new mongoose.Schema(
    { 
        createdAt: {
            type: Date,
            default: Date.now()
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A poll needs to have a user assigned to it']
        },
        imgUrl: {
            type: String,
            default: 'default.jpg'
        },
        topic: {
            type: String,
            max: 300,
            unique: [true, 'There is already a poll with this same topic. Please create another topic'],
            required: [true, 'A poll needs a topic for people to vote on']
        },
        answers: {
            type: [Object],
            validate: [ModelValidator.limitArray(2, 5), 'A poll needs at least 2 subjects to vote on but cannot have more than 5']
        }
    },
    {
        toJSON: { virtuals: true},
        toObject: { virtuals: true}
    }
)

pollSchema.virtual('highestVote').get(function(){
    let sortedAnswers = this.answers.sort(function(a,b){return a.votes - b.votes});
    let answers = [];
    tieFound = false;
    sortedAnswers.map((answer, i) => {
        if(answer.votes == sortedAnswers[sortedAnswers.length - 1].votes) {
            tiesFound = true;
            // votes.push(sortedAnswers[i].votes);
            answers.push({answer: sortedAnswers[i].answer , votes: sortedAnswers[i].votes, });
        }
    });
    
    answer = getHighestVoteQuote(answers);

    return answer;
});

function getHighestVoteQuote(answers){
    switch(answers.length){
        case 1: return `${answers[0].answer} has the highest score with ${answers[0].votes} votes`
        case 2: return `${answers[0].answer} is tied with ${answers[1].answer} for ${answers[0].votes} votes`
        case 3: return `${answers[0].answer} is tied with ${answers[1].answer} and ${answers[2].answer} for ${answers[0].votes} votes`
        case 4: return `${answers[0].answer}, ${answers[1].answer}, ${answers[2].answer} and ${answers[3].answer} are tied for ${answers[0].votes} votes`
        case 5: return `All 5 votes are tied for ${answers[0].votes}`
    }
}

pollSchema.pre(/^find/, function(next){
    this.populate({
        path: 'createdBy',
        select: 'name photo'
    })

    next();
})

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;