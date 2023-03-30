const Poll = require('./models/pollModel')
const catchAsync = require('./utils/catchAsync')

module.exports.connect = catchAsync(async (io) => {
    io.on('connection', async (socket) => {
        socket.on('send-vote', async (poll) => {
            const updatedPoll = await Poll.findById(poll.id);
            io.emit('receive-vote', {
                socket: socket.id,
                id: poll.id,
                vote: poll.vote,
                message: `${socket.id} has voted ${poll.vote} on poll: ${poll.id}`,
                answers: updatedPoll.answers,
                highestVote: updatedPoll.highestVote
            });
        });

        socket.on('created-poll', async () => {
            let newPoll = await Poll.find();
            newPoll = newPoll[newPoll.length - 1];
            console.log(newPoll);
            io.emit('receive-poll', {
                socket: socket.id,
                id: newPoll.id,
                createdBy: {
                    name: newPoll.createdBy.name,
                    photo: newPoll.createdBy.photo
                },
                highestVote: newPoll.highestVote,
                topic: newPoll.topic

            });
        })
    })
})

