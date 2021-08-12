class Filters {
  constructor(updateFunction) {
    this.constraints = [];

    this.ingredientsAutocomplete = new AutoComplete(
      this.generateIngredientsList(),
      "#ingredients",
      "blue",
      "Ingrédients"
    );

    this.appareilsAutocomplete = new AutoComplete(
      this.generateApplianceList(),
      "#appareils",
      "green",
      "Appareil"
    );

    this.ustensilesAutocomplete = new AutoComplete(
      this.generateUstensilesList(),
      "#ustensiles",
      "red",
      "Ustensiles"
    );

    this.ingredientsAutocomplete.setChipsEventFunction(
      (newConstraints, id) => {
        this.mergeConstraints(newConstraints, id);
      }
    );

    this.appareilsAutocomplete.setChipsEventFunction(
      (newConstraints, id) => {
        console.log(this.constraints, newConstraints, 'test before merge')
        this.mergeConstraints(newConstraints, id);
      }
    );

    this.ustensilesAutocomplete.setChipsEventFunction(
      (newConstraints, id) => {
        this.mergeConstraints(newConstraints, id);
      }
    );


 
    this.ingredientsAutocomplete.otherFilters = [this.ustensilesAutocomplete,  this.appareilsAutocomplete];
  
    this.ustensilesAutocomplete.otherFilters= [this.ingredientsAutocomplete,  this.appareilsAutocomplete];

    this.appareilsAutocomplete.otherFilters = [this.ustensilesAutocomplete,  this.ingredientsAutocomplete];
    
  
    this.updateFunction = updateFunction;
  }


  arrayDifference(a, b) {
    return a
      .filter((x) => !b.includes(x))
      .concat(b.filter((x) => !a.includes(x)));
  }

  mergeConstraints(newConstraints, id) {

    if (id === '#appareils') {
      this.appareilsAutocomplete.ownConstraints = newConstraints;
      console.log(this.appareilsAutocomplete.ownConstraints, 'appareils')
    }
    if (id === '#ustensiles') {
      this.ustensilesAutocomplete.ownConstraints = newConstraints;
      console.log(this.ustensilesAutocomplete.ownConstraints, 'ustensile')

    }
    if (id === '#ingredients') {
      this.ingredientsAutocomplete.ownConstraints = newConstraints;
      console.log(this.ingredientsAutocomplete.ownConstraints, 'ingredients')
    }

    let valueAppareilConstraints = this.appareilsAutocomplete.ownConstraints.length > 0 ? 1 : 0;
    let valueUstensilsConstraints = this.ustensilesAutocomplete.ownConstraints.length > 0 ? 1 : 0;
    let valueIngredientsConstraints = this.ingredientsAutocomplete.ownConstraints.length > 0 ? 1 : 0;
    console.log(valueAppareilConstraints,valueUstensilsConstraints,valueIngredientsConstraints)
    console.log(valueAppareilConstraints+valueUstensilsConstraints+valueIngredientsConstraints)

    let totalConstraints = valueAppareilConstraints + valueUstensilsConstraints + valueIngredientsConstraints;

    
    console.log((this.appareilsAutocomplete.ownConstraints.length > 0) ? 1 : 0 + (this.ingredientsAutocomplete.ownConstraints.length > 0) ? 1 : 0)
    // console.log(this.appareilsAutocomplete.ownConstraints, this.ustensilesAutocomplete.ownConstraints,  this.ingredientsAutocomplete.ownConstraints)
    let allConstraints = [...this.appareilsAutocomplete.ownConstraints, ...this.ustensilesAutocomplete.ownConstraints, ...this.ingredientsAutocomplete.ownConstraints];

    let countConstraints = {};
    for (const num of allConstraints) {
      countConstraints[num] = countConstraints[num]
        ? countConstraints[num] + 1
        : 1;
    }


console.log(countConstraints, totalConstraints);
    let arrayConstraints = [];

    for (const [idConstraint, nbcount] of Object.entries (countConstraints)) {
      if (nbcount === totalConstraints) {
        arrayConstraints = [...arrayConstraints, +idConstraint];
      }
    }
    

    this.constraints = arrayConstraints;

    this.updateFunction();
    this.ingredientsAutocomplete.updateConstraints(arrayConstraints);
    this.appareilsAutocomplete.updateConstraints(arrayConstraints);
    this.ustensilesAutocomplete.updateConstraints(arrayConstraints);
  }

  clearChips(){
    this.ingredientsAutocomplete.chips = [];
    this.appareilsAutocomplete.chips = [];
    this.ustensilesAutocomplete.chips = [];
  }

  updateSearchBarConstraints(constraints) {
    this.constraints = constraints;

    this.ustensilesAutocomplete.ownConstraints = constraints;
    this.ingredientsAutocomplete.ownConstraints = constraints;
    this.appareilsAutocomplete.ownConstraints = constraints;

    this.ustensilesAutocomplete.updateConstraints(constraints);
    this.ingredientsAutocomplete.updateConstraints(constraints);
    this.appareilsAutocomplete.updateConstraints(constraints);
  }

 
  generateIngredientsList() {
    let ingredients = {};
    let recipesToUse = [];
    if (this.constraints.length === 0) {
      recipesToUse = recipes;
    }
    else {
    recipesToUse = recipes.filter((recipe) =>
    this.constraints.includes(recipe.id)
    );
    }
    recipesToUse.forEach((recipe) => {
      recipe.ingredients.forEach((ingredientObj) => {
        const ingredient = ingredientObj.ingredient.toLowerCase();
        ingredients[ingredient] = ingredients[ingredient] || [];
        ingredients[ingredient].push(recipe.id);
      });
    });
    return ingredients;
  }

  generateApplianceList() {
    let appareils = {};

    let recipesToUse = [];
    if (this.constraints.length === 0) {
      recipesToUse = recipes;
    }
    else {
    recipesToUse = recipes.filter((recipe) =>
    this.constraints.includes(recipe.id)
    );
    }
    recipesToUse.forEach((recipe) => {
      const appareil = recipe.appliance.toLowerCase();
      appareils[appareil] = appareils[appareil] || [];
      appareils[appareil].push(recipe.id);
    });
    return appareils;
  }

  generateUstensilesList() {
    let ustensiles = {};
    let recipesToUse = [];
    if (this.constraints.length === 0) {
      recipesToUse = recipes;
    }
    else {
    recipesToUse = recipes.filter((recipe) =>
    this.constraints.includes(recipe.id)
    );
    }
    recipesToUse.forEach((recipe) => {
      recipe.ustensils.forEach((ustensile) => {
        ustensile = ustensile.toLowerCase();
        ustensiles[ustensile] = ustensiles[ustensile] || [];
        ustensiles[ustensile].push(recipe.id);
      });
    });
    return ustensiles;
  }
}
