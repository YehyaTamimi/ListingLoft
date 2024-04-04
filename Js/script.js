//import hardcoded data from json file
import json from "./newListings.js";
import { createCard } from "./createHouseCard.js";
import { requestListings } from "./requestAPI.js";
import { viewSearchHistory, addToSearchHistory, closeHistory } from "./history.js";


let searchArr = [];
let favorites = [];

document.addEventListener("DOMContentLoaded", () => {
  if(localStorage.getItem("favorite") !== null){
    favorites = JSON.parse(localStorage.getItem("favorite"));
  }
  startswiper();
  loadcontent();


  if (localStorage.getItem('history') !== null) {
    searchArr = JSON.parse(localStorage.getItem('history'));
}

  document.querySelector(".discover").addEventListener('click', () => {
    goToSearchPage()});
  const input = document.querySelector(".search-input");
    input.addEventListener("keypress", handleKeyPress);
    document.querySelector(".search").addEventListener('click', () => {
        goToSearchPage(input.value.trim());
    });
    input.addEventListener("click", () => {
        viewSearchHistory(searchArr, goToSearchPage)
    }
    );

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-input')) {
            closeHistory();
        }
    });



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


// handle Enter key press for search
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    let query = document.querySelector(".search-input").value.trim();
    goToSearchPage(query);
  }
}

const goToSearchPage = (query="") => {
  sessionStorage.setItem("query", query);
  addToSearchHistory(query, searchArr);
  window.location.href = "search.html";
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
