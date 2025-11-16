import { fetchRecipes } from "./api.js";
//selectors
const form = document.getElementById("search");
const searchInput = document.getElementById("searchInput");
const recipeList = document.getElementById("recipeList");
const recipeWindow = document.getElementById('recipeWindow');
const recipeWindowHeader = document.getElementById('recipeName');
const recipeWindowClose = document.getElementById('recipeWindowCloseButton')

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
        try {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`);
            if (!res.ok) {
                throw new Error('Web error!')
            } const data = await res.json()
            recipeWindow.style.display = 'block'
              recipeWindowHeader.textContent = data.meals[0].strMeal
        } catch (error) {
            console.log(error);
        }
    })
  });
});



// recipe window hiding logic

recipeWindowClose.addEventListener('click', (e) => {
    e.preventDefault();
    recipeWindow.style.display = 'none'
})