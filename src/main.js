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
const favorites = [];

// SEARCH LOGIC
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  recipeList.innerHTML = "";

  const recipes = await fetchRecipes(query);

  if (!recipes.length) {
    recipeList.textContent = "No recipes found";
    return;
  }

  renderRecipes(recipes);
});

// RENDER LIST OF RECIPES
function renderRecipes(recipes) {
  recipes.forEach((recipe) => {
    const recipeItem = document.createElement("li");
    const recipeThumb = document.createElement("img");
    const favoriteStar = document.createElement("span");

    favoriteStar.textContent = "X";
    favoriteStar.style.color = 'blue'
    recipeThumb.src = recipe.strMealThumb;
    recipeThumb.alt = recipe.strMeal;

    recipeItem.append(favoriteStar);
    recipeItem.append(recipeThumb, recipe.strMeal);
    recipeList.append(recipeItem);

    recipeItem.favorited = false;

    // CLICK EVENT for DETAILS
    recipeItem.addEventListener("click", (e) => {
      if (e.target.tagName != "SPAN") {
        renderRecipeDetails(recipe.idMeal)
      }
    }
      
    );
    recipeItem.addEventListener("click", () => favoriteLogic(recipeItem, favoriteStar))
  });
}

function favoriteLogic(recipeItem, favoriteStar) {
  

  if (recipeItem.favorited === false) {
    recipeItem.favorited = true;
    favoriteStar.style.color = 'red'
    favorites.push(recipeItem.textContent);
    localStorage.setItem('favoritedItems', JSON.stringify(favorites));
  } else {
    recipeItem.favorited = false;
    favorites.splice(favorites.indexOf(recipeItem.textContent), 1)
    localStorage.setItem('favoritedItems', JSON.stringify(favorites));
    favoriteStar.style.color = 'blue'
  }
}

// RENDER DETAILS OF ONE RECIPE
async function renderRecipeDetails(idMeal) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
    );
    if (!res.ok) throw new Error("Błąd sieci");

    const data = await res.json();
    const meal = data.meals[0];

    recipeWindow.style.display = "flex";
    recipeWindowHeader.textContent = meal.strMeal;
    recipeDescription.textContent = meal.strInstructions;

    recipeIngredients.innerHTML = "";

    // collecting ingredients and measures
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const mea = meal[`strMeasure${i}`];
      if (ing && ing.trim() !== "") {
        ingredients.push({ ing, mea });
      } else {
        break;
      }
    }

    // render ingredients
    ingredients.forEach(({ ing, mea }) => {
      const li = document.createElement("li");
      li.textContent = `${mea ? mea : ""} ${ing}`.trim();
      recipeIngredients.append(li);
    });
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
