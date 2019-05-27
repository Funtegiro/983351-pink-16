var navMain = document.querySelector(".page-header");
var navToggle = document.querySelector(".main-nav__toggle");

navMain.classList.remove("page-header--nojs");
navMain.classList.add("page-header--closed");

navToggle.addEventListener("click", function() {
	if (navMain.classList.contains("page-header--closed")) {
		navMain.classList.remove("page-header--closed");
		navMain.classList.add("page-header--opened");
	} else {
		navMain.classList.add("page-header--closed");
		navMain.classList.remove("page-header--opened");
	}
});

var mapImage = document.querySelector(".contacts__map-image");
var mapIframe = document.querySelector(".contacts__map-iframe");

mapImage.remove();
mapIframe.classList.remove("visually-hidden");
