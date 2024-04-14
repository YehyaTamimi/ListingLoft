export const requestListings = (query, type, callback) => {
  addLoading();
  let params;
  let apiKey = "41602150d1msh5c4982690c63891p129b85jsn781a18c8417a";
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'us-real-estate-listings.p.rapidapi.com'
    }
  };

  if (sessionStorage.getItem('params') !== null && query !== "") {
    params = JSON.parse(localStorage.getItem("params"));
  } else {
    params = {
      location: 'california',
      offset: '0',
      limit: '200',
      sort: 'newest'
    }
  }

  checkQuery(type, query, params);

  console.log(params);

  const queryString = new URLSearchParams(params).toString()
  let url = `https://us-real-estate-listings.p.rapidapi.com/for-sale?${queryString}`



  fetch(url, options)
    .then(response => {
      if (response.ok) {
        console.log("ok");
        removeLoading()
        return response.json();
      }
      return new Error("Error loading movies");
    })
    .then(callback)
    .catch(err => console.error('error:' + err));

}


const addLoading = () => {
  const body = document.querySelector("body");
  body.classList.add("grayout");
  const contain = document.createElement("div");
  contain.innerHTML = '<img src="/images/Eclipse@2x-1.0s-200px-200px.gif"/>'
  contain.classList.add("loading");

  body.appendChild(contain);
}

const removeLoading = () => {
  const body = document.querySelector("body");
  body.classList.add("grayout");
  const contain = document.querySelector(".loading");
  body.removeChild(contain);

}

const checkQuery = (type, query, params) => {
  switch (type) {
    case "rooms":
      if (query.beds_min !== "0") {
        params.bed_min = query.beds_min;
        params.beds_max = query.beds_max;
      }
      if (query.baths_min !== "0") {
        params.baths_min = query.baths_min;
        params.baths_max = query.baths_max;
      }
      break;
    case "price":
      params.price_min = query.price_min;
      params.price_max = query.price_max;
      break;
    case "size":
      params.size_min = query.size_min;
      params.size_max = query.size_max;
      break;
    case "reset-rooms":
      delete params.bed_min;
      delete params.beds_max;
      delete params.baths_min;
      delete params.baths_max;
      break;
    case "reset-price":
      delete params.price_min;
      delete params.price_max;
      break;
    case "reset-size":
      delete params.size_min;
      delete params.size_max;
      break;
    default:
      if (query !== "") {
        query = query.toLowerCase();
        //check if query only contains numbers
        let isnum = /^\d+$/.test(query);
        if (isnum === false) {
          params.location = query;
        } else {
          if (query.length >= 5) {
            params.price_max = query;
          } else {
            params.home_size_max = query;
          }
        }
      }
      break;
  }

  if (type !== "") {
    localStorage.setItem("params", JSON.stringify(params));
  }
}

