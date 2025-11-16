export async function fetchRecipes(ingridient) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingridient}`
    );
    if (!res.ok) {
      throw new Error("Web error");
    }
    const data = await res.json();
    console.log(data.meals);
    return data.meals;
    {
    }
  } catch (err) {
    console.log(err);
    return [];
  }
}

