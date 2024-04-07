
//create and show the search history
export const viewSearchHistory = (searchArr, callbackSearch) => {
    if (searchArr.length === 0) {
        return;
    }
  
    let container = document.querySelector(".search-container");
    let child = container.lastElementChild;
  
    if (child.tagName === "DIV") {
        return;
    }
  
    let div = document.createElement("div");
    div.classList.add("history");
  
    for (let query of searchArr) {
        let p = document.createElement("p");
        let i = document.createElement("i");
        i.classList.add("fa-solid", "fa-clock-rotate-left");
        p.appendChild(i);
        p.appendChild(document.createTextNode(query));
        p.addEventListener('click',() => {
            
            callbackSearch(p.lastChild.nodeValue);
        });
        div.appendChild(p);
    }
  
    container.appendChild(div);
  }
  
//append query to the search history
export const addToSearchHistory = (query, searchArr) => {
  
    if (!searchArr.includes(query) && query !== "") {
        if (searchArr.length === 5) {
            searchArr.pop();
            searchArr.unshift(query);
        } else {
            searchArr.unshift(query);
        }
    }
    console.log(searchArr)
  
    localStorage.setItem("history", JSON.stringify(searchArr));
  }
  
// close search history
export const closeHistory = () => {
    let container = document.querySelector(".search-container");
    let child = container.lastElementChild;
  
    if (child.tagName === "DIV") {
        container.removeChild(child);
    }
  }

export const saveFilter = (type, item1, item2) => {
    if(type !== "rooms"){
        localStorage.setItem(`min-${type}`, item1);
        localStorage.setItem(`max-${type}`, item2);
    }else{
        localStorage.setItem("beds", item1);
        localStorage.setItem("baths", item2);
    }
}

export const loadFilter = (type) => {
    let item1; 
    let item2;
    if(type !== "rooms"){
        item1 = localStorage.getItem(`min-${type}`);
        item2 = localStorage.getItem(`max-${type}`);
    }else{
        item1 = localStorage.getItem("beds");
        item2 = localStorage.getItem("baths");
    }

    if(item1 === "") item1 = "null";
    if(item2 === "") item2 = "null";


    return [item1, item2];
}