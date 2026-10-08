const API_URL = "https://dummyjson.com/recipes";

const STORAGE_KEY = "food-discovery";

const state = { 
    recipes: [], 
    favorites: [], 
    search: "" 
}; 

const main = document.querySelector("#main");
const favorite = document.querySelector("#favorite");
const form = document.querySelector("#search-form");
const searchInput = document.querySelector("#searchInput");
const favoritebtn = document.querySelector("#header-button");
const statusMessage = document.querySelector("#message");
const mainSection = document.querySelector(".main-section")

async function loadRecipes(query){
    statusMessage.textContent = "Loading..."

    try {
        const response =await fetch(API_URL);
     
        if(!response.ok){
            throw new Error( "Failed to load recipes");
        }

        const data = await response.json();
        state.recipes= data.recipes;

        state.search = query;
        statusMessage.textContent = "";

        renderRecipes();
    }
    catch (error){
        statusMessage.textContent = "Could not load recipe";

        console.log(error);
    }
}

function renderRecipes(){
    const term = state.search.toLowerCase();

    //filtering based on input
    const shown= state.recipes.filter((item) => 
    item.name.toLowerCase().includes(term),);

    main.innerHTML= shown.map((item) => createCard(item)).join("");
    favorite.innerHTML = state.favorites.map((item)=>createCard(item)).join("");

}

function createCard(recipes){
    const image = recipes.image;

    const saved = state.favorites.some((favorite) => favorite.id === recipes.id);

    return `
     <article class="article">
            <img src="${image}" alt="Dish image" />

            <div class="card-content">
              <p class="name">${recipes.name}</p>
              <p class="cuisine">${recipes.cuisine}</p>
              <p class="difficulty">${recipes.difficulty}</p>
              <p class="rate">${recipes.rating}</p>
            </div>

            <button class="favorite-btn" onclick="addOrRemove(${recipes.id})">${saved?"❤️":"🤍"}</button>
          </article>  `;  

}
function addOrRemove(id) {
  const exists = state.favorites.find((favorite) => favorite.id === id);

  if (exists) {
    state.favorites = state.favorites.filter((favorite) => favorite.id !== id);
  } else {
    const item = state.recipes.find((item) => item.id === id);

    if (item) {
      state.favorites.push(item);
    }
  }

  saveFavorites();

  renderRecipes();
}

function saveFavorites(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites));
}
function loadFavorites(){ 
    state.favorites = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
   
}
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const query = searchInput.value.trim();

  state.search = query;

  renderRecipes();
});

favoritebtn.addEventListener("click", function () {
    mainSection.style.display = "none";
});

function init() {
  loadFavorites();
  loadRecipes("Classic Margherita Pizza");
}

init();

    
