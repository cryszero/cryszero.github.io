var button = document.querySelector('.about-button');
var modal = document.querySelector('.aboutme');

button.addEventListener('click', function(evt){
	evt.preventDefault();
	modal.classList.toggle('modal_visible');
});