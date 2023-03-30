This app was created using Pug for the frontend rendering with Express and MongoDB for the backend build. 
In order to use it you must use the node package manager to install all dependencies.
To access the database you will need to create and edit a config.env file in the root folder of the project. Add the following environment variables to the confing.env files:

    NODE_ENV=development
    USER=Richard
    DATABASE=mongodb+srv://<USER>:<PASSWORD>@cluster0.sqewjzt.mongodb.net/?retryWrites=true&w=majority
    DATABASE_PASSWORD=WWIiP2PU6veu4DNa
    PORT=3000

    JWT_SECRET=the-legend-of-zelda-is-such-an-incredible-game

    JWT_EXPIRES_IN=90d

    JWT_COOKIE_EXPIRES_IN=90
    
    
Previously I made the mistake of adding this file in repository while it was public and sendgrid deactivated my account for security reasons.
After a few test, it seems that the blocked account does not affect the functionality of the program outside of the email sending which to me, is acceptable since the email sending for confirming the new account isn't crucial to the performance of the app.

From here you might have to create the package.json scripts which will be as follows:

    "scripts": {
        "debug": "ndb server.js",
        "debug:prod": "set NODE_ENV=production&& ndb server.js",
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "node server.js",
        "start:dev": "nodemon server.js",
        "start:prod": "set NODE_ENV=production&& nodemon server.js",
        "watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js --public-url /js",
        "build:js": "parcel build ./public/js/index.js --out-dir ./public/js --out-file bundle.js --public-url /js"
    }

Once the parameters have been added to the config.env file and the package.json scripts have been declared, you can proceed to the next step which will be to open two terminals. 

In the first terminal run the command:

    npm run watch:js

In the second terminal run the command:

    npm run start:dev

If these steps are done correctly the project should be up and running on localhost:3000

If you have any problems at all running this application, please email me at richardlg231@gmail.com

