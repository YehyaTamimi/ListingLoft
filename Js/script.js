//import hardcoded data from json file
import json from "./newListings.js";
import { createCard } from "./createHouseCard.js";
import { requestListings } from "./requestAPI.js";

let favorites = [];
document.addEventListener("DOMContentLoaded", () => {
  if(localStorage.getItem("favorite") !== null){
    favorites = JSON.parse(localStorage.getItem("favorite"));
  }
  startswiper();
  loadcontent();
  document.querySelector(".discover").addEventListener('click', goToSearchPage);
  document.querySelector(".search").addEventListener('click', goToSearchPage);
  document.querySelector(".search-input").addEventListener("keypress", handleKeyPress);
  document.querySelector(".favorites").addEventListener("click", goToFavorites);
})


//load content from json file
const loadcontent = () => {
  let houses = json["listings"];
  let count = 10;

  houses.forEach((house) => {
    if (count === 0) return;
    createCard(house);
    count--;
  });
  checkFavorites();
}

const goToFavorites = () => {
  window.location.href = "favorites.html";
}

const startswiper = () => {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 3,
    spaceBetween: 30,
    freeMode: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

// handle Enter key press for search
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    goToSearchPage();
  }
}

const goToSearchPage = () => {
  const input = document.querySelector(".search-input");
  sessionStorage.setItem("query", input.value.trim());
  window.location.href = "search.html";
}

const checkFavorites = ()=>{
  favorites.forEach((card) => {
    try{
      const element = document.querySelector(`.${card}`)
      console.log(element)
      const icon = element.querySelector(".add-favorite i");
      console.log(icon)
      icon.classList.add("fa-solid");
    }catch{
      return;
    }
  })
}
