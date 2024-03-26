// hamburger
const hamburger = document.querySelector(".hamburger_btn");
const nav = document.querySelector("nav");
const close_btn = document.querySelector(".close_btn");

function shownav() {
  nav.classList.add("active_nav");
}
function hidenav() {
  nav.classList.remove("active_nav");
}
hamburger.addEventListener("click", shownav);
close_btn.addEventListener("click", hidenav);

hamburger.addEventListener("click", shownav);
close_btn.addEventListener("click", hidenav);

// Slider
const images = [
  "url(../images/comp1.png)",
  "url(../images/cs.jpeg)",
  "url(../images/cs2.jpeg)",
];
let index = 0;

function changeBackground() {
  document.body.style.backgroundImage = images[index];
  index = (index + 1) % images.length;
}

// Change background every 5 seconds (adjust as needed)
setInterval(changeBackground, 5000);


