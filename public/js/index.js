/* eslint-disable */
import { io } from 'socket.io-client';
import '@babel/polyfill';
import { showAlert } from './alerts';
import { displayMap } from './mapBox';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { createPoll } from './createPoll'
import { increaseVote } from './increaseVote';
import { ieNoOpen } from 'helmet';
import { updatePolls, updateVote, updateVoltorbCount, updateHouseCount } from './DOMFeatures';

// const socket = io('http://localhost:3000')

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const settingsForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-settings');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const pollForm = document.querySelector('.form--poll');

const voteBtn1 = document.getElementById('vote-1');
const voteBtn2 = document.getElementById('vote-2');
const voteBtn3 = document.getElementById('vote-3');
const voteBtn4 = document.getElementById('vote-4');
const voteBtn5 = document.getElementById('vote-5');

const buildings = document.querySelectorAll('.building');

const btnAddHouse = document.querySelectorAll('.btn--add');
const btnSubtractHouse = document.querySelectorAll('.btn--subtract');

if(btnAddHouse.length > 0){
    for(let i = 0; i < btnAddHouse.length; i++){
        let btn = btnAddHouse[i];
        let housesElement = btnAddHouse[i].parentElement.previousSibling.lastChild
        let wattsElement = btnAddHouse[i].parentElement.previousSibling.previousSibling.lastChild
        console.log(wattsElement);
        btn.addEventListener("click", function(){
            updateHouseCount(1, housesElement, wattsElement, buildings[i])
            updateVoltorbCount(buildings);
        });
    }
}

if(btnSubtractHouse.length > 0){
    for(let i = 0; i < btnSubtractHouse.length; i++){
        let btn = btnSubtractHouse[i];
        let housesElement = btnSubtractHouse[i].parentElement.previousSibling.lastChild
        let wattsElement = btnSubtractHouse[i].parentElement.previousSibling.previousSibling.lastChild
        btn.addEventListener("click", function(){
            updateHouseCount(-1, housesElement, wattsElement, buildings[i])
            updateVoltorbCount(buildings);
        });
    }
}

if(buildings.length > 0){
    updateVoltorbCount(buildings);
}

/*
    Jubilife Power Plant Process

    Galaxy Team is conducting experiments and decides Jubilife Village needs a new powerplant
    Professor Laventon decides Voltorb is the best candidate for the electric supply for the new power plant
    Voltorb is 0.5m (1' 8") tall and weighs 10.4kg (22.8 lbs)

    -- Find out how much electricity is produced by a generator that weighs as close as possible to the weight of Voltorb

    ?? Theoretically, Voltorb has no energy conversion loss and therefore is far more efficient than a generator, possibly even up to
        3 times more than the average generator which typically produces 5000-6500 watts. For this we will say the average voltorb produces
        
        !! In 2018 it was recored that the total Conversion Loss of power when using a fuel resource such as coal, natural gas, nuclear 
        and renewable was around 60% meaning that only 40% of the total energy was converted to electricity. We will say Voltorb converts 80%
        bringing the wattage produced to 13000 watts
        -- Source: https://www.eia.gov/todayinenergy/detail.php?id=41193#:~:text=Electricity%20is%20a%20secondary%20energy%20source%20that%20is,quads%20in%202018%2C%20or%2061%25%20of%20total%20consumption.
        Voltorb = 13000watts
        !! Electrode could possibly produce 1.5 times the amount that Voltorb could. bringing the total to 19500watts
        Electrode = 19500watts

    ?? What buildings are in Jubilife Village and what real world buildings could we equate wattage usage with?
    
        The Average House uses 1223 watts to power
            -- Source: https://www.forbes.com/home-improvement/home/how-many-watts-run-house/

        !! Jubilife Village consists of 
        -- 1 Galaxy Hall = Town Hall 16 Houses
            -- 1 Clothier = Clothing Shop = 4 Houses
            -- 1 Craftworks = Crafts Shop = 4 Houses
            -- 1 Farm = Farm
            -- 1 General Store = 4 Houses
            -- 1 Hairdresser = Hair Salon = 1 House
            -- 1 Pastures = 1 Field (No Electricity Required) = 0 Houses
            -- 1 Photo Studio = Photo Studio = 3 Houses
            -- The Wall Flower = 1 Restaurant = 5 Houses
            -- 1 Trading Post = Trading Post = 4 Houses
            -- 1 Training Ground = Training Ground = 0 Houses
            -- Your House = 1 House 
            -- 12 Houses = 12 Houses

            !! Total Houses = 56 House = 56 * 1223 = 68488
            Total Power Consumption = 68488
            !! 68488 / 13000 = 5.27
            Voltorbs Needed = Math.ceil(5.27) = 6

            ?? How much Excess power would be generated?
            6 * 13000 = 78000
            Total Power Generated = 78000
            78000 - 68488 = 9512

            !! 68488 / 18500 = 3.51
            Electrodes Needed = Math.ceil(3.51) = 4

            Total Power Generated = 78000
            74000 - 68488 = 9512

            Best Combo is either  4 Electrodes or 6 Voltorbs which produces 68500 leaving 9512 watts in excess power generated
            
            Extra -- What combination of Voltorb and Electrode would be needed to reduce the Excess power generated as much as possible?

*/

const socket = io('http://localhost:3000');
socket.on('connect', () => {
    // showAlert('success', "You have connected to the server", 20)
})

socket.on('receive-vote', poll => {
    updateVote(poll, `.poll_answer--vote`);
})

socket.on('receive-poll', poll => {
    updatePolls(poll);
})

async function setBtnListener(btn, vote){
    btn.addEventListener('click', async e => {
        const id = document.getElementById('poll').dataset.id
        await increaseVote(id, vote);
        
        socket.emit('send-vote', { id, vote }); 
    }
)}
    
if(voteBtn1){
    setBtnListener(voteBtn1, 1);
}

if(voteBtn2){
    setBtnListener(voteBtn2, 2);
}

if(voteBtn3){
    setBtnListener(voteBtn3, 3);
}

if(voteBtn4){
    setBtnListener(voteBtn4, 4);
}

if(voteBtn5){
    setBtnListener(voteBtn5, 5);
}

// DELEGATE EVENTS
if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if(pollForm){
    pollForm.addEventListener('submit', async e => {
        e.preventDefault();
        const topic = document.getElementById('poll--topic').value;
        const answer1 = document.getElementById('poll--answer1').value;
        const answer2 = document.getElementById('poll--answer2').value;
        const answer3 = document.getElementById('poll--answer3').value;
        const answer4 = document.getElementById('poll--answer4').value;
        const answer5 = document.getElementById('poll--answer5').value;

        const poll = {
            topic,
            answers: [
                { answer: answer1 },
                { answer: answer2 },
                { answer: answer3 },
                { answer: answer4 },
                { answer: answer5 }
            ]
        }

        await createPoll(poll);

        socket.emit('created-poll')
    })
}

if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);      
    });
}

if(signupForm){
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const passwordConfirm = document.getElementById('signup-password-confirm').value;
        signup(name, email, password, passwordConfirm);

        name = document.getElementById('signup-name').value = '';
        email = document.getElementById('signup-email').value = '';
        password = document.getElementById('signup-password').value = '';
        passwordConfirm = document.getElementById('signup-password-confirm').value = '';
    });
}

if(settingsForm){
    settingsForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        
        updateSettings(form, 'data');
    });
}

if(passwordForm){
    passwordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').innerHTML = 'Updating...'

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({passwordCurrent, password, passwordConfirm}, 'password');

        document.querySelector('.btn--save-password').innerHTML = 'Saved Password'

        passwordCurrent = document.getElementById('password-current').value = '';
        password = document.getElementById('password').value = '';
        passwordConfirm = document.getElementById('password-confirm').value = '';
    });
}

if(logoutBtn) logoutBtn.addEventListener('click', logout);

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);