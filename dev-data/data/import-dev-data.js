const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./../../models/userModel');
const Poll = require('./../../models/pollModel');

dotenv.config({ path: `./config.env`});

const DB = process.env.DATABASE
    .replace(`<PASSWORD>`, process.env.DATABASE_PASSWORD )
    .replace(`<USER>`, process.env.USER );

mongoose
.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
.then(() => console.log(`DB connection successful`));

// Read json data
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const polls = JSON.parse(fs.readFileSync(`${__dirname}/polls.json`, 'utf-8'));

const importData = async () => {
    try {
        await User.create(users, { validateBeforeSave: false });
        await Poll.create(polls, { validateBeforeSave: false });

        console.log('Data successfully loaded');
        process.exit();
    }
    catch (err) {
        console.log(err);
    }
};

// Delete all data from database
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Poll.deleteMany();
        console.log('Data successfully deleted');
        process.exit();
    }
    catch (err) {
        console.log(err);
    }
}

const saveFile = async(Schema) => {
    let data = [];

    switch(Schema){
        case `User`:

            data = await User.find();

            
            data.map( user => {
                user.password = 'test1234'
            })

            console.log(data);

            break;
            
        case `Poll`:
            data = await Poll.find();
            break;
    }

    await fs.writeFileSync(`${__dirname}/${Schema.toLowerCase()}s.json`, JSON.stringify(data));

    process.exit();
}

if(process.argv[2] === '--import') importData();
if(process.argv[2] === '--delete') deleteData();
if(process.argv[2] === '--save' && process.argv[3]) saveFile(process.argv[3]);

console.log(process.argv);
