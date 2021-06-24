
const container = document.querySelector('.row')

function createCard(){
    container.innerHTML = recipes.map(recette =>
        `
        <div class="card col-sm-12 col-md-offset-2 col-md-8 col-lg-offset-0 col-lg-4" style="width: 18rem;">
            <div class="card-title">
                <h1> ${recette.name} </h1>
                <span><i class="fas fa-clock" ></i> ${recette.time} min</span>
            </div>
            <div class="card-body">
                <div class="ingredient">
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