

export const requestListings = (query, filter, callback, favorite = false, counter = 0) => {
  if (counter === 0) {
    addLoading();
  }

  let apiKey = "f1b4ea8720mshd5da3624d5deaf5p1d48bfjsn5c5167d9b4aa";
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'us-real-estate-listings.p.rapidapi.com'
    }
  };

  let url;
  let params;

  if (favorite) {
    params = {
      id: query
    };

  } else {
    params = checkQuery(query, filter);
    console.log(params);
  }

  const queryString = new URLSearchParams(params).toString();
  url = favorite ? `https://us-real-estate-listings.p.rapidapi.com/v2/property?${queryString}` : `https://us-real-estate-listings.p.rapidapi.com/for-sale?${queryString}`;

  fetch(url, options)
    .then(response => {
      if (response.ok) {
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
  contain.innerHTML = '<img src="/ListingLoft/images/Eclipse@2x-1.0s-200px-200px.gif"/>'
  contain.classList.add("loading");

  body.appendChild(contain);
}

const removeLoading = () => {
  const body = document.querySelector("body");
  body.classList.add("grayout");
  const contain = document.querySelector(".loading");
  if (contain) {
    body.removeChild(contain);
  }

}

const checkQuery = (query, filter) => {
  let params = {
    location: 'california',
    offset: '0',
    limit: '200',
    sort: 'newest'
  }

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

  return { ...params, ...filter };
}
