let pontos = 0;

const placar = document.getElementById("placar");
const btnMais = document.querySelector(".btn.mais");
const btnMenos = document.querySelector(".btn.menos");
const btnReset = document.querySelector(".btn.reset");
const btnInfo = document.querySelector(".btn-info");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const audioUp = new Audio("assets/sound.mp3");
const audioDown = new Audio("assets/sound2.mp3");

if(localStorage.getItem("pontos")) {
    let value = parseInt(localStorage.getItem("pontos"));
    if(value >= 0 && value <= 99) pontos = value;
    atualizar();
}

function vibrar() {
    if(navigator.vibrate) navigator.vibrate(40);
}

function abrir() {
    modal.style.display = 'flex';
    pulse(btnInfo);
    play(audioDown);
    setTimeout(() => pulse(modalContent), 50);
}

function fechar() {
    modal.style.display = 'none';
}

function pulse(el) {
    el.classList.add("pulse");
    setTimeout(() => el.classList.remove("pulse"), 120);
}

function play(audio) {
    audio.currentTime = 0;
    audio.play();
}

function atualizar() {
    placar.innerText = pontos;

    if(pontos >= 30) {
        placar.classList.add("verde");
    } else {
        placar.classList.remove("verde");
    }

    pulse(placar);
    localStorage.setItem("pontos", pontos);
}

function aumentar(animate = false) {
    if(pontos < 99) pontos++;
    vibrar();
    atualizar();
    if(animate) pulse(btnMais);
    play(audioUp);
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
    play(audioUp);
}

function diminuir(animate = false) {
    if(pontos > 0) pontos--;
    vibrar();
    atualizar();
    if(animate) pulse(btnMenos);
    play(audioDown);
}

function resetar() {
    pontos = 0;
    vibrar();
    atualizar();
    pulse(btnReset);
    play(audioDown);
}

document.body.addEventListener("click", function(e) {
    const largura = window.innerWidth;
    const x = e.clientX;
    const ignored = ["btn", "btn-info", "modal", "shortcut"];

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