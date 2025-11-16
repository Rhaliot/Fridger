import {fetchRecipes} from './api.js'

const form = document.getElementById("search")
const searchInput = document.getElementById("searchInput");
const recipeList = document.getElementById("recipeList");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const query = searchInput.value.trim();
  if (!query) return; 
  recipeList.innerHTML = '';
  const recipes = await fetchRecipes(query); 
  
  recipes.forEach(recipe => {
  const recipeObject = document.createElement("li")
  const recipeThumb = document.createElement("img")
  recipeThumb.src = recipe.strMealThumb;
  recipeObject.append(recipe.strMeal)
  recipeList.append(recipeObject);
  recipeList.append(recipeThumb)
});



});
