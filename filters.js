class Filters {
  arrayDifference(a, b) {
    return a
      .filter((x) => !b.includes(x))
      .concat(b.filter((x) => !a.includes(x)));
  }

  mergeConstraints(newConstraints, oldConstraints, type) {
    this.constraints = newConstraints;
    console.log(this.constraints, newConstraints)
    // if (type === "add") {
    //   this.constraints = [
    //     ...new Set(
    //       this.constraints
    //         .filter((c) => newConstraints.includes(c))
    //         .concat(diff)
    //     ),
    //   ];
    // } else if (type === "remove") {
    //   this.constraints = this.appareilsAutocomplete.getChipsConstraints();
    //   if (this.constraints.length === 0) {
    //     this.constraints = this.ingredientsAutocomplete.getChipsConstraints();
    //   } else {
    //     let tc = this.ingredientsAutocomplete.getChipsConstraints();
    //     if (tc.length > 0) {
    //       this.constraints = this.constraints.filter((c) => tc.includes(c));
    //     }
    //   }
    //   if (this.constraints.length === 0) {
    //     this.constraints = this.ustensilesAutocomplete.getChipsConstraints();
    //   } else {
    //     let tc = this.ustensilesAutocomplete.getChipsConstraints();
    //     if (tc.length > 0) {
    //       this.constraints = this.constraints.filter((c) => tc.includes(c));
    //     }
    //   }

    //   this.constraints = [...new Set(this.constraints)];
    // }
    this.updateFunction();
    this.ingredientsAutocomplete.updateConstraints(this.constraints);
    this.appareilsAutocomplete.updateConstraints(this.constraints);
    this.ustensilesAutocomplete.updateConstraints(this.constraints);
  }

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
      (newConstraints, oldConstraints, type) => {
        this.mergeConstraints(newConstraints, oldConstraints, type);
      }
    );

    this.appareilsAutocomplete.setChipsEventFunction(
      (newConstraints, oldConstraints, type) => {
        console.log(this.constraints, newConstraints, 'test before merge')
        this.mergeConstraints(newConstraints, oldConstraints, type);
      }
    );

    this.ustensilesAutocomplete.setChipsEventFunction(
      (newConstraints, oldConstraints, type) => {
        this.mergeConstraints(newConstraints, oldConstraints, type);
      }
    );
    this.updateFunction = updateFunction;
  }

  updateSearchBarConstraints(constraints) {
    this.constraints = constraints;
    this.ustensilesAutocomplete.updateConstraints(constraints);
    this.ingredientsAutocomplete.updateConstraints(constraints);
    this.appareilsAutocomplete.updateConstraints(constraints);
  }

 
  generateIngredientsList() {
    let ingredients = {};
    let recipesToUse = recipes.filter((recipe) =>
    this.constraints.includes(recipe.id)
    );
    if (this.constraints.length === 0) {
      recipesToUse = recipes;
    }
    console.log(recipes)
    console.log(recipesToUse)
    console.log(this.constraints)
    recipesToUse.forEach((recipe) => {
      recipe.ingredients.forEach((ingredientObj) => {
        const ingredient = ingredientObj.ingredient.toLowerCase();
        ingredients[ingredient] = ingredients[ingredient] || [];
        ingredients[ingredient].push(recipe.id);
      });
    });
    console.log(ingredients)
    return ingredients;
  }

  generateApplianceList() {
    let appareils = {};

    recipes.forEach((recipe) => {
      const appareil = recipe.appliance.toLowerCase();
      appareils[appareil] = appareils[appareil] || [];
      appareils[appareil].push(recipe.id);
    });
    return appareils;
  }

  generateUstensilesList() {
    let ustensiles = {};

    recipes.forEach((recipe) => {
      recipe.ustensils.forEach((ustensile) => {
        ustensile = ustensile.toLowerCase();
        ustensiles[ustensile] = ustensiles[ustensile] || [];
        ustensiles[ustensile].push(recipe.id);
      });
    });
    return ustensiles;
  }
}
