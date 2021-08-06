class Filters {
  arrayDifference(a, b) {
    return a
      .filter((x) => !b.includes(x))
      .concat(b.filter((x) => !a.includes(x)));
  }

  mergeConstraints(newConstraints, oldConstraints, type) {
    let diff = this.arrayDifference(newConstraints, oldConstraints);

    if (this.constraints.length > 0) {
      diff = diff.filter((d) => this.constraints.includes(d));
    }

    if (type === "add") {
      this.constraints = [
        ...new Set(
          this.constraints
            .filter((c) => newConstraints.includes(c))
            .concat(diff)
        ),
      ];
    } else if (type === "remove") {
      this.constraints = this.appareilsAutocomplete.getChipsConstraints();
      if (this.constraints.length === 0) {
        this.constraints = this.ingredientsAutocomplete.getChipsConstraints();
      } else {
        let tc = this.ingredientsAutocomplete.getChipsConstraints();
        if (tc.length > 0) {
          this.constraints = this.constraints.filter((c) => tc.includes(c));
        }
      }
      if (this.constraints.length === 0) {
        this.constraints = this.ustensilesAutocomplete.getChipsConstraints();
      } else {
        let tc = this.ustensilesAutocomplete.getChipsConstraints();
        if (tc.length > 0) {
          this.constraints = this.constraints.filter((c) => tc.includes(c));
        }
      }

      this.constraints = [...new Set(this.constraints)];
    }
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

    recipes.forEach((recipe, index) => {
      recipe.ingredients.forEach((ingredientObj) => {
        const ingredient = ingredientObj.ingredient.toLowerCase();
        ingredients[ingredient] = ingredients[ingredient] || [];
        ingredients[ingredient].push(index);
      });
    });
    return ingredients;
  }

  generateApplianceList() {
    let appareils = {};

    recipes.forEach((recipe, index) => {
      const appareil = recipe.appliance.toLowerCase();
      appareils[appareil] = appareils[appareil] || [];
      appareils[appareil].push(index);
    });
    return appareils;
  }

  generateUstensilesList() {
    let ustensiles = {};

    recipes.forEach((recipe, index) => {
      recipe.ustensils.forEach((ustensile) => {
        ustensile = ustensile.toLowerCase();
        ustensiles[ustensile] = ustensiles[ustensile] || [];
        ustensiles[ustensile].push(index);
      });
    });
    return ustensiles;
  }
}
