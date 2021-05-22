
const menuToggle = document.querySelector('#menuToggle');
const mainNav = document.querySelector('#mainNav');

menuToggle.addEventListener('click',() => {

    if(mainNav.classList.contains('menuOpen')){
        mainNav.classList.remove('menuOpen');
    }else{
        mainNav.classList.add('menuOpen');
    }
})