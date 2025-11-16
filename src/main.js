import { fetchRecipes } from "./api.js";
//selectors
const form = document.getElementById("search");
const searchInput = document.getElementById("searchInput");
const recipeList = document.getElementById("recipeList");
const recipe = document.querySelector('li')

// search logic and showing entries
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();
  if (!query) return;
  recipeList.innerHTML = "";
  const recipes = await fetchRecipes(query);

  recipes.forEach((recipe) => {
    
    const recipeObject = document.createElement("li");
    const recipeThumb = document.createElement("img");
    recipeThumb.src = recipe.strMealThumb;
    recipeObject.append(recipe.strMeal);
    recipeList.append(recipeObject);
    recipeList.append(recipeThumb);

    // list item click behavior

    recipeObject.addEventListener('click', async (e) => {
        console.log(recipe.idMeal)
    })
  });
});

