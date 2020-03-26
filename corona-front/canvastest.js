let isAtBottom = true;
let scoreList = [];
let interval;
let seconds;
let round;
let gamer;
let drawing = false;
let queueOfEvents = [];
let processingEvent = false;
let processingEraseEvent = false;
let whoDraws;
let hasSomeoneGuessed = false;

let canvas,
  ctx,
  flag = false,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  dot_flag = false;
  currentColor = "black",
  currentWeight = 5,
  hintsGiven = 0;

const MAX_CHAT_OUTPUT = 50;
// const backendUrl = "181.169.164.99:3000";
const backendUrl = "coronadrawgame.herokuapp.com";
// const backendUrl = "localhost:3000";
const superEvent={eventType:"path", event:[]};

const skipBtn =  document.getElementById('skip-icon');
const hintBtn = document.getElementById('btn_hint');
const gameBoardIcons = document.querySelector('.icons');
const gameBoardGuessIcons = document.querySelector('.game-board__guessing');
const chatOut = document.querySelector('.chat-output');
const wordToDrawPanel = document.querySelector(".game-board__word");
const timer = document.querySelector(".game-board__timer").children[0];
const rankingTable = document.querySelector('.l-panel-score__table > tbody');
const saveDrawBtn = document.getElementById('saveDrawBtn');
const inputName = document.getElementById('input-name');

canvas = document.getElementById("can");
ctx = canvas.getContext("2d");
w = canvas.width;
h = canvas.height;

let listeners = {
  mousemove: "move",
  mousedown: "down",
  mouseup: "up",
  mouseout: "out"
};

for (const prop in listeners) {
  canvas.addEventListener(
    prop,
    function(e) {
      findxy(listeners[prop], e);
    },
    false
  );
}

function selectToolOrColor(id) {
  switch (id) {
    case "small-brush":
      currentWeight = 5;
      break;
    case "medium-brush":
      currentWeight = 10;
      break;
    case "big-brush":
      currentWeight = 20;
      break; 
    case "clean-tool":
      if (drawing) erase();
      break;
    default:
      currentColor = id;
  }
}

function draw(prevX, prevY, currX, currY, color, weight) {
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.strokeStyle = color;
  ctx.lineWidth = weight;
  ctx.lineJoin = "round";
  ctx.lineTo(currX, currY);
  ctx.closePath();
  ctx.stroke();
}

function erase() {
  processingEraseEvent = true;
  if (!drawing && processingEvent){
    setTimeout(erase, 1000);
    return;
  }
  //animacion para que se mas bonito :3
  const delay = 200; //delay para hacer mas smooth la animacion
  setTimeout(() => {
    let i = 0; 
      for (let j = 0; j < w / 10; j++) {
      setTimeout(() => {
        ctx.clearRect(j, 0, (j + 1) * 10, h);
      }, i);
      i = (i + 15) * 0.99; //smooth transition
    }
  }, delay);
  //395 milliseconds is the time the animation lasts
  setTimeout( () => {processingErasfeEvent = false; }, delay+395);
  // ctx.clearRect(0, 0, w, h); // borrar sin animacion
  if (drawing){
    sendEraseEventToServer();
  }
}

function findxy(res, e) {
  if (!drawing || processingEraseEvent) {
    flag = false;
    return;
  }
  if (res == "down") {
    prevX = currX;
    prevY = currY;
    currX = e.offsetX;
    currY = e.clientY  + (canvas.height / 2) - canvas.offsetParent.offsetParent.offsetTop;
    flag = true;
    queueOfEvents.push({ prevX:currX, prevY:currY, currX:currX+0.01, currY:currY+0.01, currentColor, currentWeight }); 
    draw(currX, currY, currX+0.01, currY+0.01, currentColor, currentWeight);
    if (dot_flag) {
      ctx.beginPath();
      ctx.fillStyle = currentColor;
      ctx.fillRect(currX, currY, 2, 2);
      ctx.closePath();
      dot_flag = false;
    }
  }
  if (res == "up" || res == "out") {
    flag = false;
    taskDrawing();

  }
  if (res == "move") {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.offsetX;
      currY = e.clientY  + (canvas.height / 2) - canvas.offsetParent.offsetParent.offsetTop;
      queueOfEvents.push({ prevX, prevY, currX, currY, currentColor, currentWeight });
      draw(prevX, prevY, currX, currY, currentColor, currentWeight);
    }
  }
}

const setWhoIsDrawing = name => {
  for (let i = 0; i < rankingTable.children.length; i++) {
    if (name === rankingTable.children[i].children[0].innerText) {
      rankingTable.children[i].children[0].classList.add('user-is-drawing');
    } else {
      rankingTable.children[i].children[0].classList.remove('user-is-drawing');
    }
  }
}


const sendPathsToServer = data => {
  socket.send(JSON.stringify({eventType:'path', event:data}))
};

const sendEraseEventToServer = () => {
  socket.send(JSON.stringify({eventType:'erase'}));
};

const sendMessageToServer = messageData => {
  socket.send(JSON.stringify({eventType:'chat', event:messageData}));
};

skipBtn.addEventListener('click', e => {
  if(!hasSomeoneGuessed) {
    socket.send(JSON.stringify({eventType:'skip'}));
  } else {
    console.log("No puedes skipear porque adivinaron");
  }
});

document.querySelector('.game-board__guessing-icons')
  .addEventListener('click', e => {
    const id = e.target.closest('div').id;
    switch(id) {
      case "like-icon":
        socket.send(JSON.stringify({eventType:'like'}));
        break;
      case "report-icon":
        socket.send(JSON.stringify({eventType:'report'}));
        break;
      default:
        return;
    }
  });

const addMessageToChat = (message) => {
  let chat = document.querySelector(".chat-output");
    let item = document.createElement("div");
    item.classList.add("chat-text__line");
    switch(message.from) {
      case "chat-user__join":
        let score = {name:message.username, points: message.points}
        addRanking(score, true);
        scoreList.push(score);
        currentGamers++;
        playersInRoomText.innerText = `Players: ${currentGamers} / ${maxGamers}`;
        break;
      case "chat-user__left":
      item.classList.add("chat-user__join-left");
        removeFromRanking(message.username);
        currentGamers--;
        playersInRoomText.innerText = `Players: ${currentGamers} / ${maxGamers}`;
        break;
      case "chat-correctword":
        hasSomeoneGuessed = true;
      case "chat-user__won":
        item.classList.add(message.from);
        break;
      case "chat-word":
        item.classList.add(message.from);
        item.appendChild(document.createTextNode("The word was "));
        let word = document.createElement("span");
        word.appendChild(document.createTextNode(message.word));
        item.appendChild(word);
        break;
      default:
        let username = document.createElement("span");
        username.classList.add("chat-user");
        username.appendChild(document.createTextNode(message.from + ": "));
        item.appendChild(username);
    }
    if (message.from != "chat-word"){
      item.appendChild(document.createTextNode(message.text));
    }
    chat.appendChild(item);
    scrollChatOutput();    
    if (chatOut.children.length > MAX_CHAT_OUTPUT) {
      chatOut.children[0].remove();
    }
}

const startStopWatch = (secs) => {
  round = true;
  seconds = secs;
  interval = setInterval( () => {
    seconds--;
    timer.innerHTML = seconds;
    if (seconds < 1 || round == false){
      clearInterval(interval);
    }
  }, 1000);
}

const finishRound = (event) => {
  flag = false;
  round = false;
  clearInterval(interval);
  timer.innerHTML = "";
  addMessageToChat({from: "chat-word", text: "The word was ", word: event.word});
}


const roomNameText = document.querySelector(".l-panel-room__name");
const currentRoundText = document.querySelector(".l-panel-round__title");
const playersInRoomText = document.querySelector(".l-panel-playersinroom");
let maxGamers;
let maxRounds;
let currentGamers;

const displayRoom = (event) => {
  let {roomName, currentRound, rounds, maxPlayers, time, hint, numOfGamers, ranking, whoDraws} = event;
  whoDraws = whoDraws;
  roomNameText.innerHTML = roomName;
  maxRounds = rounds;
  maxGamers = maxPlayers
  currentGamers = numOfGamers;
  currentRoundText.innerText = `Round ${currentRound} of ${rounds}`;
  playersInRoomText.innerText = `Players: ${numOfGamers} / ${maxPlayers}`;
  round = true;
  scoreList = ranking;
  startRankings(scoreList);
  wordToDrawPanel.innerHTML = `Wait until the next turn to start guessing`;
  setWhoIsDrawing(whoDraws);
  if (time != 0 && currentRound!=0)
    startStopWatch(time);
}

const processEvent = item => {
  console.log(item);
  const { eventType, event } = item;
  switch (eventType) {
    case "erase":
      erase();
      break;
    case "chat":
      addMessageToChat(event);
      break;
    case "connection":
      gamer.id = event.id;
      localStorage.setItem("crn_id", gamer.id);
      displayRoom(event);
      break;
    case "ranking":
      updateRankings(event);
      break;
    case "new-round":
      whoDraws = event.whoDraws;
      startStopWatch(event.seconds);
      inputMessage.disabled = false;
      if (drawing){
        gameBoardGuessIcons.classList.toggle('hide');
        gameBoardIcons.classList.toggle('hide');
        skipBtn.classList.toggle('hide');
      }
      hintsGiven = 0;
      hasSomeoneGuessed = false;
      hintBtn.classList.remove('disabled', 'hide');
      hintBtn.innerText = 'ask for hint';
      wordToDrawPanel.innerHTML = `Too hard? Ask ${whoDraws} for a hint`;
      gameBoardGuessIcons.querySelector("p").innerHTML = `${whoDraws} is currently drawing`;
      setWhoIsDrawing(whoDraws);
      drawing = false;
      processingEvent = false;
      currentRoundText.innerText = `Round ${event.currentRound} of ${maxRounds}`;
      break;
    case "round-finished":
      finishRound(event);
      break;
    case "game-finished":
      cleanRankings();
      addMessageToChat({from: "chat-user__won", text: `${event.name} won the game with ${event.points} points`});
      break;
    case "you-draw":
      if (!drawing) {
        drawing = true;
        gameBoardGuessIcons.classList.toggle('hide');
        gameBoardIcons.classList.toggle('hide');
        skipBtn.classList.toggle('hide');
        hintBtn.classList.remove('hide');
        hintBtn.innerText = 'give hint';
      }
      hintsGiven = 0;
      hasSomeoneGuessed = false;
      hintBtn.classList.remove('disabled');
      inputMessage.disabled = true;
      wordToDrawPanel.innerHTML = "You have to draw: " + "<span>"+event.word+"</span>";
      currentRoundText.innerText = `Round ${event.currentRound} of ${maxRounds}`;
      startStopWatch(event.time);
      setWhoIsDrawing(gamer.name);
      break;
    case "hint": {
      wordToDrawPanel.innerHTML = "Word Hint: " + "<span>"+event+"</span>";
      break;
    }
    case "path": 
      processingEvent = true;
      let cont = 0;
      event.forEach(eventItem => {
        cont += 20;
        const { prevX, prevY, currX, currY, currentColor, currentWeight } = eventItem;
        setTimeout(() => {
          draw(prevX, prevY, currX, currY, currentColor, currentWeight);
        }, cont);
      });
      setTimeout(() => (processingEvent = false), event.length * 20);
      break;
    case "path-at-first": 
      processingEvent = true;
      event.forEach(eventItem => {
        const { prevX, prevY, currX, currY, currentColor, currentWeight } = eventItem;
          draw(prevX, prevY, currX, currY, currentColor, currentWeight);
      });
      processingEvent = false;
      break;
    case "askForHint": 
      askForHint(event.name);
      break;
    default:
      return;
  }
};

const askForHint = (name) => {
  let cell;
  for (i=0; i< rankingTable.rows.length; i++){
    if (rankingTable.rows[i].cells[0].innerText == name){
      cell = rankingTable.rows[i].cells[1];
      break;
    }
  }
  cell.classList.add("hint-titling");
  const titling = setInterval(() => {
    cell.classList.toggle("hint-titling");
  }, 800);
  setTimeout(() => {
    cell.classList.remove("hint-titling");
    cell.style.opacity = '';
    clearInterval(titling);
  }, 4000);

}

const cleanRankings = () => {
  scoreList.forEach( score => {
    score.points = 0;
  });
  rankingTable.innerHTML = '';
  scoreList.forEach(score => addRanking({
    name: score.name,
    points: score.points
  }), true);
}
const updateRankings = events => {
  scoreList.forEach( score => {
    for (i=0;i<events.length;i++){
      if (score.name == events[i].name){
        score.points = events[i].points;
      }
    }
  })
  scoreList.sort((a, b) => (b.points - a.points));
  rankingTable.innerHTML = '';
  scoreList.forEach(score => addRanking({
    name: score.name,
    points: score.points
  }, score.name == events[0].name || score.name == events[1].name));
  setWhoIsDrawing(whoDraws);
}

const startRankings = scores => {
  scores.sort((a, b) => (b.points - a.points));
  rankingTable.innerHTML = '';
  scores.forEach(score => addRanking({
    name: score.name,
    points: score.points
  }));
}

const addRanking = (event, animation) => {
  const playerScore = document.createElement('tr');
  if (animation)
    playerScore.classList.add('score-updated');
  playerScore.classList.add('score-board__row');

  playerScore.innerHTML = `
      <td class="l-panel-score__user">${event.name}</td>
      <td class="l-panel-score__hint">Hint!</td>
      <td class="l-panel-score__user-score">${event.points}</td>
     `
  if (animation)
    setTimeout(() => {playerScore.classList.remove('score-updated')}, 200);
  rankingTable.append(playerScore);
}

const removeFromRanking = (name) => {
  scoreList = scoreList.filter( (score) => score.name != name);
  let i;
  for (i=0; i< rankingTable.rows.length; i++){
    if (rankingTable.rows[i].cells[0].innerText == name){
      break;
    }
  }
  rankingTable.deleteRow(i);
}

document
  .querySelector(".icons")
  .addEventListener("click", e => selectToolOrColor(e.target.closest('div').id));


let socket;
let playing = false;
const navigationButtons = e => {
  e.preventDefault()
  const introPanel = document.querySelector('.intro-panel');
  const container = document.getElementById('container');
  const selectRoom = document.getElementById('roomSelect');
  if (inputName.value.trim() === '') {
    inputName.classList.add('invalid-input')
    setTimeout( () => inputName.classList.remove('invalid-input'),1500);
    return;
  }
  
  gamer = {
    name: inputName.value,
    room: selectRoom.options[selectRoom.selectedIndex].value
  };

  introPanel.classList.toggle('hide');
  container.classList.toggle('hide');
  playing = !playing;
  if (!playing){
    socket.close();
    clearInterval(interval);
    chatOut.innerHTML = "";
    return;
  }
  socket = new WebSocket('ws://' + backendUrl);

	socket.addEventListener('open', function () {
    let event = {
      name: gamer.name,
      room_id: gamer.room, 
      restoredID: localStorage.getItem("crn_id")};
	  socket.send(JSON.stringify({event, eventType:"connect"}));
  });

	socket.addEventListener('message', function (event) {
    var data = JSON.parse(event.data);
    if (data.eventType!= "path" || (!processingEvent && !processingEraseEvent && !superEvent.event[0])){
      processEvent(data);
    } else {
      superEvent.event = superEvent.event.concat(data.event);
      let interval = setInterval( () =>{
        if (!processingEvent && !processingEraseEvent){
          if (superEvent.event[0]){
            processEvent(superEvent);
            superEvent.event = [];
          }
          clearInterval(interval);
        }
      }, 500);
    }
	});
}

document.getElementById("play-btn").addEventListener('click', navigationButtons);
document.getElementById("goback-btn").addEventListener('click', navigationButtons);

const taskDrawing = function() {
  if (drawing && queueOfEvents[0]){
      sendPathsToServer(queueOfEvents);
      queueOfEvents = [];
    }
}

setInterval(taskDrawing, 5000);

const inputMessage = document.querySelector(".input-text");
document
  .getElementById("chat-input")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.elements[0].value.trim() === '') {
      e.target.elements[0].classList.add('invalid-input')
      setTimeout( () => e.target.elements[0].classList.remove('invalid-input'),1500)
      return;
    }
    e.target.elements[0].classList.remove('invalid-input');
    sendMessageToServer({message:e.target.elements[0].value})
    inputMessage.value = "";
  });

  
  let oldValue = "";
  document
  .querySelector(".input-text")
  .addEventListener("input", (e) => {
    e.preventDefault();
    if (e.target.value.length > 100) {
      e.target.value = oldValue;
      return;
    } else {
      oldValue = e.target.value;
    }
  });
   
  hintBtn.addEventListener('click', () => {
    if (hintsGiven>=2){
      hintBtn.classList.add('disabled');
      hintBtn.disabled = true;
      return;
    }
    hintsGiven++;
    if(drawing) {
      socket.send(JSON.stringify({eventType:'hint'}));
    } else {
      socket.send(JSON.stringify({eventType:'askForHint'}));
    }
    hintBtn.classList.add('disabled');
    hintBtn.disabled = true;
      setTimeout(() => {
        hintBtn.classList.remove('disabled');
        hintBtn.disabled = false;
      }, 1000);  
    
  })

  function scrollChatOutput () {
    if (isAtBottom) {
      chatOut.scrollTop = chatOut.scrollHeight;
    }
  }

  chatOut.addEventListener('scroll', function() {
    isAtBottom =  chatOut.scrollHeight - (chatOut.scrollTop + chatOut.clientHeight) < 100;
    });


saveDrawBtn.addEventListener('click', (e) => {
  let link = document.createElement('a');
  link.download = whoDraws + '-coronadraw-' + (new Date()).getTime() + '.png';
  link.href = document.getElementById('can').toDataURL('image/png');
  link.click();
});

window.onload = function() {
  inputName.focus();
}