import { fetchRecipes } from "./api.js";

// SELECTORS
const form = document.getElementById("search");
const searchInput = document.getElementById("searchInput");
const recipeList = document.getElementById("recipeList");
const recipeWindow = document.getElementById("recipeWindow");
const recipeWindowHeader = document.getElementById("recipeName");
const recipeWindowClose = document.getElementById("recipeWindowCloseButton");
const recipeDescription = document.getElementById("recipeDescription");
const recipeIngredients = document.getElementById("recipeIngredients");
const recipeFavoriteButton = document.getElementById("recipeFavoriteButton");

// GLOBAL STATE
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ---------- STORAGE HELPERS ----------
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function loadFavorites() {
  favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites;
}

// ---------- FAVORITE LOGIC ----------
function isFavoriteById(idMeal) {
  return favorites.some(f => f.idMeal === idMeal);
}

function addRecipeToFavorites(meal) {
  loadFavorites(); 
  const exists = favorites.some(f => f.idMeal === meal.idMeal);
  if (exists) return; 
  favorites.push(meal);
  saveFavorites();
}

function deleteRecipeFromFavorites(meal) {
  loadFavorites();
  favorites = favorites.filter(f => f.idMeal !== meal.idMeal);
  saveFavorites();
}

// Toggle helper used from UI (returns new state)
function toggleFavorite(meal) {
  loadFavorites();
  const exists = favorites.some(f => f.idMeal === meal.idMeal);
  if (exists) {
    favorites = favorites.filter(f => f.idMeal !== meal.idMeal);
  } else {
    favorites.push(meal);
  }
  saveFavorites();
  return !exists;
}

function checkFavoriteState(meal) {
  loadFavorites();
  const exists = favorites.some(f => f.idMeal === meal.idMeal);
  recipeFavoriteButton.style.color = exists ? "green" : "red";
  return exists;
}

// ---------- SEARCH LOGIC ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  recipeList.innerHTML = "";

  const recipes = await fetchRecipes(query);

  if (!recipes || recipes.length === 0) {
    recipeList.textContent = "No recipes found";
    return;
  }

  renderRecipes(recipes);
});

// ---------- RENDER LIST OF RECIPES ----------
function renderRecipes(recipes) {
  recipeList.innerHTML = ""; 
  loadFavorites();

  recipes.forEach((recipe) => {
    const recipeItem = document.createElement("li");
    const recipeThumb = document.createElement("img");
    const nameSpan = document.createElement("span");
    const favoriteStar = document.createElement("span");

    // setup elements
    favoriteStar.textContent = "★";
    favoriteStar.style.cursor = "pointer";
    favoriteStar.style.marginRight = "8px";

    nameSpan.textContent = recipe.strMeal;
    recipeThumb.src = recipe.strMealThumb;
    recipeThumb.alt = recipe.strMeal;
    recipeThumb.style.width = "80px";
    recipeThumb.style.height = "80px";
    recipeThumb.style.objectFit = "cover";
    recipeThumb.style.marginRight = "8px";

    // set favorite color based on state
    favoriteStar.style.color = isFavoriteById(recipe.idMeal) ? "red" : "gray";

    // append
    recipeItem.append(favoriteStar, recipeThumb, nameSpan);
    recipeList.append(recipeItem);

    // favorite click (only star)
    favoriteStar.addEventListener("click", (e) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(recipe);
      favoriteStar.style.color = nowFav ? "red" : "gray";
    });

  
    recipeThumb.addEventListener("click", () => renderRecipeDetails(recipe.idMeal));
    nameSpan.addEventListener("click", () => renderRecipeDetails(recipe.idMeal));
    
  });
}

// ---------- RENDER DETAILS OF ONE RECIPE ----------
async function renderRecipeDetails(idMeal) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
    );
    if (!res.ok) throw new Error("Błąd sieci");

    const data = await res.json();
    const meal = data.meals[0];

    // show window
    recipeWindow.style.display = "flex";
    recipeWindowHeader.textContent = meal.strMeal;
    recipeDescription.textContent = meal.strInstructions || "";
    recipeIngredients.innerHTML = "";

    // collecting ingredients and measures
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const mea = meal[`strMeasure${i}`];
      if (ing && ing.trim() !== "") {
        ingredients.push({ ing: ing.trim(), mea: (mea || "").trim() });
      } else {
       
      }
    }

    // render ingredients
    ingredients.forEach(({ ing, mea }) => {
      const li = document.createElement("li");
      li.textContent = `${mea ? mea + " " : ""}${ing}`.trim();
      recipeIngredients.append(li);
    });

    // set favorite button initial state
    checkFavoriteState(meal);

    // set handler 
    recipeFavoriteButton.onclick = () => {
      const nowFav = toggleFavorite(meal);
      recipeFavoriteButton.style.color = nowFav ? "green" : "red";
    };
  } catch (error) {
    console.error(error);
    recipeWindowHeader.textContent = "Error";
    recipeDescription.textContent = "";
    recipeIngredients.innerHTML = "";
  }
}

// CLOSE RECIPE WINDOW
recipeWindowClose.addEventListener("click", () => {
  recipeWindow.style.display = "none";
});
