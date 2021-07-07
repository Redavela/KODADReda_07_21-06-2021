
const container = document.querySelector('.row')

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

class Tree{
    constructor(elements){
        this.tree = {}
        this.objectExplorer(elements)
        console.log(this.tree);
    }
    addToTree(node){
        let currentTree = this.tree
        for(const letter of node){
            currentTree[letter] = currentTree[letter] || {}
            currentTree = currentTree[letter]
         }
    }
    objectExplorer(node){
        if(node){
            if(typeof node === 'object' || Array.isArray(node) ){
                for(const key in node){
                    this.objectExplorer(node[key])
                }
            }
            else if(typeof node === 'string' && isNaN(parseFloat(node))){
                const words = node.split(" ")
                for(const word of words){
                    this.addToTree(word.toLowerCase())
                }
            }
        }
   }
} 



function algoRechercheArbre(){
    const tree = new Tree(recipes)
}