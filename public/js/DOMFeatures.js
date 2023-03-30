const title = 'App Title | ';

export const updatePolls = function(poll){
    let elements = document.getElementsByClassName('poll_container--list')
    if(document.title == title + 'Overview'){
        const template = `<li class="poll_container--list column">
        <a href="/polls/${poll.id}" id="poll-${poll.id}" class="poll_container--link poll"> ${poll.topic} 
        <p class="poll_container--creator"> Asked by: ${poll.createdBy.name}</p>
        <img class="circle" src="img/users/${poll.createdBy.photo}">
        <p id="poll-${poll.id}--highest-vote">Highest Vote: ${poll.highestVote.answer} with ${poll.highestVote.votes} votes</p>
        </a>
        </li>`

        elements[elements.length - 1].insertAdjacentHTML('afterend', template)
    }
}

function findIdByName(name, id){
    return name == id;
}

export const updateVote = function(poll, id){
    const elements = document.querySelectorAll(id);
    if(elements.length > 0){
        for(let i = 0; i < elements.length; i++){
            console.log(poll.answers)
            console.log(elements[i].id)
            elements[i].innerHTML = poll.answers.find( vote => findIdByName(`vote-text-${vote.answer}`, elements[i].id)).votes;  
        }
    }

    const pollElement = document.getElementById(`poll-${poll.id}--highest-vote`)
    if(pollElement != undefined){
        pollElement.innerText = `Highest Vote: ${poll.highestVote.answer} with ${poll.highestVote.votes} votes`
    }

}

export const updateVoltorbCount = function(buildings){
    let watts = 0;
    if(buildings.length > 0){
        for(let i = 0; i < buildings.length; i++){
            watts += parseInt(buildings[i].dataset.watts)
        }
    }
    
    let voltorbCount = document.getElementById(`voltorb--count`)
    let totalWattsUsed = document.getElementById(`total-watts--count`)
    let excessWattsProduced = document.getElementById(`excess-watts--count`)
    if(voltorbCount != undefined){
        voltorbCount.innerText = Math.ceil(watts / 13000)
        totalWattsUsed.innerText = watts
        excessWattsProduced.innerText = parseInt(voltorbCount.innerText) * 13000 - watts
    }
}

export const updateHouseCount = function(count, houses, watts, building){
    if(parseInt(houses.innerHTML) > 0 || count == 1){
        houses.innerHTML = `${parseInt(houses.innerHTML) + (1 * count)}`;
        watts.innerHTML = parseInt(watts.innerHTML) + (1223 * count);
        building.dataset.watts = watts.innerHTML;
        console.log(building);
        console.log(watts.parentNode, houses);
    }
    else console.log('Cannot have less than 0 houses')
}