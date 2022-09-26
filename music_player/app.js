
const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");

const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");

const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");

const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");



const player = new MusicPlayer(musicList);
let music = player.getMusic();


window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
})


function displayMusic(music) {
    title.innerHTML = music.getName();
    singer.innerHTML = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
})

function pauseMusic() {
    container.classList.remove("playing");
    play.querySelector("i").classList ="fa-solid fa-play";
    audio.pause();
}


function playMusic() {
    container.classList.add("playing");
    play.querySelector("i").classList ="fa-solid fa-pause";
    audio.play();
}



//previous
prev.addEventListener("click", () => {
    prevMusic();
})

function prevMusic() {
    player.previous();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}

//next
next.addEventListener("click", () => {
    nextMusic();
})

function nextMusic() {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}




const calculateTime = (toplamSaniye) => {
    const dakika = Math.floor(toplamSaniye / 60);
    const saniye = Math.floor(toplamSaniye % 60);
    const guncellenenSaniye = saniye < 10 ? `0${saniye}`: `${saniye}`;
    const sonuc = `${dakika}:${guncellenenSaniye}`;
    return sonuc;
}

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
});



progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value); 
    audio.currentTime = progressBar.value;
});



let sesDurumu = "sessiz";
volume.addEventListener("click", () => {

    if(sesDurumu==="sesli") {
        audio.muted = true;
        sesDurumu = "sessiz";
        volume.classList.remove("fa-volume-high");
        volume.classList.add("fa-volume-xmark");
        volumeBar.value = audio.volume*100;
    }
    else {
        volume.classList.add("fa-volume-high");
        volume.classList.remove("fa-volume-xmark");
        audio.muted = false;
        sesDurumu = "sesli";
        volumeBar.value = audio.volume*100;
    }

});


volumeBar.addEventListener("input", (e) => {
    const sesDuzey = e.target.value;
    audio.volume = sesDuzey / 100;
    if(sesDuzey==0) {
        volume.classList.remove("fa-volume-high");
        volume.classList.add("fa-volume-xmark");
    }
    else {
        volume.classList.add("fa-volume-high");
        volume.classList.remove("fa-volume-xmark");
    }
});



const displayMusicList = (list) => {
    for(let i = 0; i<list.length; i++) {
        let liTag = `
            <li li-index="${i}" onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
                <span>${list[i].getName()}</span>
                <span id="music-${i}" class="badge bg-primary rounded-pill">3:40</span>
                <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
            </li>
        `;

        ul.insertAdjacentHTML("beforeend", liTag);


        let liAudioDuration = ul.querySelector(`#music-${i}`);
        let liAudioTag = ul.querySelector(`.music-${i}`);

        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudioTag.duration);
        })

        
    }
}


const selectedMusic = (li) => {
    const index = li.getAttribute("li-index");
    player.index = index;
    displayMusic(player.getMusic());
    playMusic();
    isPlayingNow();
}


const isPlayingNow = () => {
    for(let li of ul.querySelectorAll("li")) {
        if(li.classList.contains("playing")) {
            li.classList.remove("playing");
        }
        if(li.getAttribute("li-index") == player.index) {
            li.classList.add("playing");
        }
    }
}

audio.addEventListener("ended", () => {
    nextMusic();
})