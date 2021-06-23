function displayList(){
    let container = document.querySelector('.row')
    container.innerHTML=''
    for(i=0 ; i<recipes.length;i++){
        container.appendChild(createCard(recipes[i].name,recipes[i].time, recipes[i].description))
        for(let j=0 ;j<recipes[i].ingredients.length ;j++){
            container.appendChild(addIngredients(recipes[i].ingredients[j].ingredient, recipes[i].ingredients[j].quantity, recipes[i].ingredients[j].quantite, recipes[i].ingredients[j].unit  ))
            }
            
    }
}
displayList()
function addIngredients(ingredient, quantity, quantite, unit) {
    const div = document.createElement('div')
    const pIngredient = document.createElement('p')
    div.className = 'card'
    pIngredient.className = 'card-text'
    pIngredient.innerText = ingredient + ' : ' 
    div.appendChild(pIngredient)
    return div

}
function createCard(name,time, description){
    const div = document.createElement('div')
    const div2 = document.createElement('div')
    const titre = document.createElement('h5')
    const para = document.createElement('p')
    const icon = document.createElement('i')
    const divTime = document.createElement('div')
    div.className = 'card'
    div.style.width = '18rem'
    div2.className = 'card-body'
    titre.className = 'card-title'
    titre.innerText = name
    para.className ='card-text'
    para.innerText = description
    para.className = 'card-time'
    icon.className = 'fa-solid fa-clock'
    divTime.innerText = time
    icon.appendChild(divTime)
    div2.appendChild(titre)
    div2.appendChild(icon)
    div2.appendChild(para)
    div.appendChild(div2)
    return div
}