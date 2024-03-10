const hamburger = document.querySelector(".hamburger_btn")
const nav = document.querySelector("nav")
const close_btn=document.querySelector(".close_btn")

function shownav() {
    nav.classList.add("active_nav")
}
function hidenav() {
    nav.classList.remove("active_nav")
}
hamburger.addEventListener("click", shownav)
close_btn.addEventListener("click",hidenav)

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Swiper
    var swiper = new Swiper('#swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
});