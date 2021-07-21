
const container = document.querySelector('.container')

function createCard(){
    container.innerHTML = recipes.map(recette =>
        `
        <div class="card col-sm-12 col-md-offset-2 col-md-8 col-lg-offset-0 col-lg-4 " style="width: 18rem;">
            <div class="card-img"></div>
            <div class="card-body">
            <header class="card-title">
                <h2> ${recette.name} </h2>
                <span><i class="fas fa-clock" ></i> ${recette.time} min</span>
            </header>
                <div class="card-ingredient">
                    ${recette.ingredients.map(element =>
                         `<div><span><b>${element.ingredient}: </b></span>
                         <span>${ "quantity" in element ? element.quantity : ""} </span>
                         <span>${ "unit" in element? element.unit : ""}</span>
                         </div>`).join('')}
                </div>
                <div class="card-text">
                    <span>${recette.description}</span>
                </div>        
            </div>
        </div>
        `).join('')
}
createCard()

function generateIngredientsList(){
    let ingredients = {}
    
    recipes.forEach((recipe,index) => {
        recipe.ingredients.forEach(ingredientObj =>{
            const ingredient = ingredientObj.ingredient.toLowerCase()
            ingredients[ingredient] = ingredients[ingredient]||[]
            ingredients[ingredient].push(index)
        })
    });
    return ingredients
}

function generateApplianceList(){
    let appareils = {}
    
    recipes.forEach((recipe,index) => {
        const appareil = recipe.appliance.toLowerCase()
        appareils[appareil] = appareils[appareil]||[]
        appareils[appareil].push(index)
    });
    return appareils
} 

function generateUstensilesList(){
    let ustensiles = {}
    
    recipes.forEach((recipe,index) => {
        recipe.ustensils.forEach(ustensile=>{
        ustensile = ustensile.toLowerCase()
        ustensiles[ustensile] = ustensiles[ustensile]||[]
        ustensiles[ustensile].push(index)
        })
        
    });
    return ustensiles
}

const ingredientsAutocomplete = new AutoComplete(
  generateIngredientsList(),
  "#ingredients",
  "blue",
  "Ingrédients"
);


const appareilsAutocomplete = new AutoComplete(
  generateApplianceList(),
  "#appareils",
  "green",
  "Appareil"
);

const ustensilesAutocomplete = new AutoComplete(
  generateUstensilesList(),
  "#ustensiles",
  "red",
  "Ustensiles"
);

ingredientsAutocomplete.setChipsEventFunction((constraints)=>{
    appareilsAutocomplete.updateConstraints(constraints)
})