
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
        this.objectExplorer(elements, null)
    }
    addToTree(node, parent){
        let currentTree = this.tree
        for(const letter of node){
            currentTree[letter] = currentTree[letter] || {}
            currentTree = currentTree[letter]
         }
        currentTree['_elements'] = currentTree['_elements'] || []
        currentTree['_elements'].push(parent)
    }
    objectExplorer(node, parent){
        if(node){
            if(typeof node === 'object' || Array.isArray(node) ){
                node['_parent'] = parent
                for(const key in node){
                    if(key !== '_parent'){
                        this.objectExplorer(node[key], node)
                    }    
                }
            }
            else if(typeof node === 'string' && isNaN(parseFloat(node))){
                const words = node.split(" ")
                
                for(const word of words){
                    this.addToTree(word.toLowerCase(), parent)
                }
            }
        }
   }
   browseTree(combinaisons, text) {
    const result = {};
    var currentTree = this.tree;
    for (const letter of text) {
      if (letter in currentTree) {
        currentTree = currentTree[letter];
      }
    }
    const elements = this.gatherElements(currentTree);
    for (const element of elements) {
      for (const combinaison of combinaisons) {
        if (Object.keys(element).includes(combinaison)) {
          result[combinaison] = result[combinaison] || [];
          result[combinaison].push({
            element: element[combinaison],
            parent: element,
          });
        }
      }
    }
    return result;
  }
   gatherElements(tree){
    let elements = []
    let toVisit = [tree]

       while(toVisit.length !== 0){
           const currentTree = toVisit.pop()
         
           if("_elements" in currentTree){
               elements = elements.concat(currentTree._elements);
           }
           for( const key in currentTree)
           {
               if(key !== '_elements'){
                toVisit.push(currentTree[key])
               }
           }
       }
       return elements
   }
} 

algoRechercheArbre(['ingredient','name','description'],'tom')

function algoRechercheArbre(combinaisons,text){
    const tree = new Tree(recipes)
    return tree.browseTree(combinaisons,text)
}