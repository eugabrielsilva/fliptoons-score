const placar = document.getElementById('placar');
const btnMais = document.querySelector('.btn.mais');
const btnMenos = document.querySelector('.btn.menos');
const btnReset = document.querySelector('.btn.reset');
const btnInfo = document.querySelector('.btn-info');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const audioUp = [new Audio('assets/sound.mp3'), new Audio('assets/sound.mp3')];
const audioDown = [new Audio('assets/sound2.mp3'), new Audio('assets/sound2.mp3')];
const audioVictory = [new Audio('assets/sound3.mp3'), new Audio('assets/sound3.mp3')];
const confetti = new Confetti();

let pontos = 0;
let audioUpIndex = 0;
let audioDownIndex = 0;
let audioVictoryIndex = 0;
let isVictory = false;

if(localStorage.getItem('pontos')) {
    let value = parseInt(localStorage.getItem('pontos'));
    if(value >= 0 && value <= 99) pontos = value;
    atualizar();
}

function vibrar() {
    if(navigator.vibrate) navigator.vibrate(40);
}

function abrir() {
    modal.style.display = 'flex';
    pulse(btnInfo);
    playAudioDown();
    setTimeout(() => pulse(modalContent), 50);
}

function fechar() {
    modal.style.display = 'none';
}

function pulse(el) {
    el.classList.add('pulse');
    setTimeout(() => el.classList.remove('pulse'), 120);
}

function playAudioUp() {
    audioUp[audioUpIndex].currentTime = 0;
    audioUp[audioUpIndex].play();
    audioUpIndex = (audioUpIndex + 1) % audioUp.length;
}

function playAudioDown() {
    audioDown[audioDownIndex].currentTime = 0;
    audioDown[audioDownIndex].play();
    audioDownIndex = (audioDownIndex + 1) % audioDown.length;
}

function playAudioVictory() {
    audioVictory[audioVictoryIndex].currentTime = 0;
    audioVictory[audioVictoryIndex].play();
    audioVictoryIndex = (audioVictoryIndex + 1) % audioVictory.length;
}

function atualizar() {
    placar.innerText = pontos;

    if(pontos >= 30) {
        placar.classList.add('verde');
        if(!isVictory) {
            victory();
        }
    } else {
        placar.classList.remove('verde');
        confetti.stop();
        isVictory = false;
    }

    pulse(placar);
    localStorage.setItem('pontos', pontos);
}

function victory() {
    confetti.launch();
    isVictory = true;
    playAudioVictory();
}

function aumentar(animate = false) {
    if(pontos < 99) pontos++;
    vibrar();
    atualizar();
    if(animate) pulse(btnMais);
    playAudioUp();
}

function atalho(valor, e) {
    if(pontos + valor <= 99) {
        pontos += valor;
    } else {
        pontos = 99;
    }
    vibrar();
    atualizar();
    pulse(e.currentTarget);
    playAudioUp();
}

function diminuir(animate = false) {
    if(pontos > 0) pontos--;
    vibrar();
    atualizar();
    if(animate) pulse(btnMenos);
    playAudioDown();
}

function resetar() {
    pontos = 0;
    vibrar();
    atualizar();
    pulse(btnReset);
    playAudioDown();
}

document.body.addEventListener('click', function(e) {
    const largura = window.innerWidth;
    const x = e.clientX;
    const ignored = ['btn', 'btn-info', 'modal', 'shortcut'];

    if(ignored.some(cls => e.target.classList.contains(cls))) return;

    if(x < largura / 2) {
        diminuir();
    } else {
        aumentar();
    }
});

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}