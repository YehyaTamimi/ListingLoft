


document.addEventListener("DOMContentLoaded", () => {
    startswiper();
    document.querySelector(".discover").addEventListener('click', goToSearchPage)
    document.querySelector(".search").addEventListener('click', goToSearchPage);;
    document.querySelector(".search-input").addEventListener("keypress", (e) => {
      if (e.key === 'Enter') {
          goToSearchPage();
      }});
})


const goToSearchPage = () => {
  window.location.href = "search.html";
}

const startswiper = () =>{
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

// const js = 