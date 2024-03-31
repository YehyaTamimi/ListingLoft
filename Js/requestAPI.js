export const requestListings = () => {
    let apiKey = "41602150d1msh5c4982690c63891p129b85jsn781a18c8417a";
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'us-real-estate-listings.p.rapidapi.com'
      }
    };
  
    const params = {
      location: 'Metairie, LA',
      offset: '0',
      limit: '100',
      sort: 'newest'
    }
  
    const queryString = new URLSearchParams(params).toString()
    let url = `https://us-real-estate-listings.p.rapidapi.com/for-sale?${queryString}`
  
    return fetch(url, options)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return new Error("Error loading movies");
      })
      .then(loadcontent)
      .catch(err => console.error('error:' + err));
  
  }





