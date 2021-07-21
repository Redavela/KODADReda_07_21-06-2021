
const searchButton = document.getElementById('submit-btn')
let searchTerm = ''
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


function algoRecherche(combinaisons, text){
    let result = {}

    let visite = [{ key: "recipes", value: recipes, parent: null }]

    while(visite.length !== 0 ){
        let current = visite.pop()
        if(typeof current.value === 'object' || Array.isArray(current.value) ){
            for(const key in current.value){
                visite.push({
                    key,
                    value:current.value[key],
                    parent:current
                })
            }
        }
        
        else if(typeof current.value === 'string'){
            for(const combinaison of combinaisons){
                if(current.key === combinaison){
                    if(current.value.toLowerCase().includes(text.toLowerCase())){
                        result[combinaison] = result[combinaison] || []
                        result[combinaison].push(current)
                    }
                }
            }

        }
    }
    return result  
}

searchButton.addEventListener('click',(e)=>{
    e.preventDefault()
    const searchInput = document.getElementById('search-input')
    console.log(algoRecherche(['name','ingredient','description'], searchInput.value))
})
createCard()

const filters = new Filters()