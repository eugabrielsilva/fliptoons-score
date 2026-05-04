const placar = document.getElementById('placar');
const btnMais = document.querySelector('.btn.mais');
const btnMenos = document.querySelector('.btn.menos');
const btnReset = document.querySelector('.btn.reset');
const btnInfo = document.querySelector('.btn-info');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const confetti = new Confetti();

let audios = {
    'up': {
        src: [new Audio('assets/sound.mp3'), new Audio('assets/sound.mp3')],
        index: 0
    },
    'down': {
        src: [new Audio('assets/sound2.mp3'), new Audio('assets/sound2.mp3')],
        index: 0
    },
    'victory': {
        src: [new Audio('assets/sound3.mp3'), new Audio('assets/sound3.mp3')],
        index: 0
    }
}

let pontos = 0;
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
    tocarAudio('down');
    setTimeout(() => pulse(modalContent), 50);
}

function fechar() {
    modal.style.display = 'none';
}

function pulse(el) {
    el.classList.add('pulse');
    setTimeout(() => el.classList.remove('pulse'), 120);
}

function tocarAudio(asset) {
    const i = audios[asset].index;
    audios[asset].src[i].currentTime = 0;
    audios[asset].src[i].play();
    audios[asset].index = (i + 1) % audios[asset].src.length;
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
    tocarAudio('victory');
}

function aumentar(animate = false) {
    if(pontos < 99) pontos++;
    vibrar();
    atualizar();
    if(animate) pulse(btnMais);
    tocarAudio('up');
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
    tocarAudio('up');
}

function diminuir(animate = false) {
    if(pontos > 0) pontos--;
    vibrar();
    atualizar();
    if(animate) pulse(btnMenos);
    tocarAudio('down');
}

function resetar() {
    pontos = 0;
    vibrar();
    atualizar();
    pulse(btnReset);
    tocarAudio('down');
}

document.body.addEventListener('click', function(e) {
    const largura = window.innerWidth;
    const x = e.clientX;
    const ignored = ['btn', 'btn-info', 'modal', 'modal-content', 'shortcut'];

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