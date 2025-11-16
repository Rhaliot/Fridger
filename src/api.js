const form = document.getElementById("search")
const searchInput = document.getElementById("searchInput");
const recipeList = document.getElementById("recipeList");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const query = searchInput.value.trim();
  if (!query) return; 
  recipeList.innerHTML = ''
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


export async function fetchRecipes(ingridient) {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingridient}`);
        if (!res.ok) { throw new Error("Web error")};
        const data = await res.json();
        console.log(data.meals);
        return data.meals;
         {}
    } catch (err) {
        console.log(err);
        return [];
    }
}
