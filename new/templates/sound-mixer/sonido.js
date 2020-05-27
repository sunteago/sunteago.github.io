const arraySounds = [];
const soundsPlaying = [];
const soundsNames = ['Lofi Rain','Seagulls','Seagulls2','Machine','Machine2','Water','Zen','Unknown','Lofi','Rain','Traffic','Forest'];
soundsNames.length;
let numOfSoundsPlaying = 0;
const INITIAL_VOLUME =  0.8 ;
const NUM_SOUNDS = 12;

const container = document.getElementById('container');
const soundsPlayingDOM = document.getElementById('sounds-playing');

const updateNumOfSoundsPlaying = () => {
  if (!numOfSoundsPlaying) {
    soundsPlayingDOM.innerText = 'No sounds playing'
    return;
  }
  soundsPlayingDOM.innerText = numOfSoundsPlaying;
}

for (let i = 0; i < NUM_SOUNDS; i++) {
  //howl sound
  arraySounds[i] = new Howl({
    src: [`./sounds/${i}.ogg`, `./sounds/${i}.mp3`],
    loop: true,
    volume: generateRandomVolumeNumber()
  });
  
  //create title 
  const soundTitle = document.createElement('h4');
  soundTitle.innerText = soundsNames[i];
  
  //create array of buttons
  const soundButton = document.createElement("button");
  soundButton.innerHTML = `[ Paused ]`;

  //create sliders
  const slider = document.createElement("input");
  passSlideAttributes(slider, i);
  
  const slideContainer = document.createElement('div')
  slideContainer.classList.add('slide-container');
  slideContainer.append(slider);

  const soundContainer = document.createElement('div');
  soundContainer.classList.add('sound-container');
  soundContainer.append(soundTitle, soundButton,slideContainer);
  container.append(soundContainer);

  //add play stop
  soundButton.addEventListener("click", function() {
    clickButtonHandler(i, arraySounds[i], this);
  });

  //add volume
  slider.addEventListener("input", e => {
    const volValue = e.target.value;
    arraySounds[i].volume(volValue);
    // soundsPlaying[idx].volume = volValue;
  })
}

function clickButtonHandler(idx, sound, thisBtn) {
  const soundVol = arraySounds[idx]._volume;
  if (!soundsPlaying[idx] || soundsPlaying[idx].status === "Paused") {
    soundsPlaying[idx] = {};
    const id = sound.play();
    soundsPlaying[idx].id = id;
    sound.fade(0, soundVol, 1000, soundsPlaying[idx].id);
    soundsPlaying[idx].status = "Playing";
    numOfSoundsPlaying++;
  } else  {
    sound.fade(soundVol, 0, 1000, soundsPlaying[idx].id);
    setTimeout(() => sound.pause(soundsPlaying[idx].id), 1000);
    soundsPlaying[idx].status = "Paused";
    numOfSoundsPlaying--;
  }
  updateNumOfSoundsPlaying();
  thisBtn.classList.toggle('playing');
  thisBtn.innerHTML = `[ ${soundsPlaying[idx].status} ] `;
}

function passSlideAttributes(slider,idx) {
  slider.setAttribute("type", "range");
  slider.setAttribute("max", "1");
  slider.setAttribute("min", "0");
  slider.setAttribute("step", "0.05");
  slider.setAttribute("name", "single-volume");
  slider.setAttribute("class", "slider");
  slider.value = arraySounds[idx]._volume;
}

function generateRandomVolumeNumber () {
  return (Math.random() * 80 + 30) / 100;
}