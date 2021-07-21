class AutoComplete {
  constructor(items, id, color, title) {
    this.items = items;
    this.title = title;
    this.color = color;
    this.text = "";
    this.id = id;
    this.constraints = [];
    this.filteredItems = Object.keys(items);
    this.chips = [];
    this.chipsEventFunction = null
    this.showList = false;

    this.render();
  }

  setChipsEventFunction(fn) {
    this.chipsEventFunction = fn
  }

  getItems() {
    let keys = [];
    //
    if (this.constraints.length === 0) {
      return Object.keys(this.items);
    }
    // trie sur les recettes qu'on a spécifié
    for (const item in this.items) {
      if (this.items[item].find((e) =>
          this.constraints.includes(e)
        )) {
        keys.push(item);
      }
    }
    return keys;
  }

  getDom() {
    const domElement = document.querySelector(this.id);

    if (!domElement) {
      console.error(`Node element ${this.id} not found`);
      return;
    }

    return domElement;
  }

  updateConstraints(constraints) {
    // N affiche que les éléments qui sont présents dans la liste des reccettes specifiées
    this.constraints = constraints;

    this.filteredItems = this.getItems();

    this.generateChips();
    this.generateList();
  }

  removeChildren(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  getConstraints() {
    let chipsConstraints = this.chips.map(chip => this.items[chip]) || []
    if (chipsConstraints.length === 0) {
      return [];
    }
    return [...new Set(chipsConstraints.reduce((a, e) => a.concat(e)))]
  }

  addToChips(label) {
    this.chips.push(label);

    this.chipsEventFunction(this.getConstraints());

    this.filteredItems.splice(this.filteredItems.indexOf(label), 1);

    this.generateChips();
    this.generateList();
  }

  addToList(label) {
    if (label.includes(this.text)) {
      this.filteredItems.push(label);
    }

    this.chips.splice(this.chips.indexOf(label), 1);

    this.chipsEventFunction(this.getConstraints());

    this.generateChips();
    this.generateList();
  }

  generateChips() {
    const dom = document.querySelector(`${this.id} .ac-chips`);
    // Génère les vignettes (html+événements)
    this.removeChildren(dom);

    this.chips.forEach((item) => {
      const elem = document.createElement("button");
      const close = document.createElement("i");

      elem.innerText = item;
      close.onclick = () => {
        this.addToList(item);
      };
      close.classList.add("far", "fa-times-circle");
      close.style.marginLeft = "5px";
      elem.appendChild(close);
      dom.appendChild(elem);
    });
  }

  generateList() {
    // Génère la liste des ingrédients (html+événements)
    const dom = document.querySelector(`${this.id} .ac-body`);
    this.removeChildren(dom);

    this.filteredItems.forEach((item) => {
      const container = document.createElement("div");
      const elem = document.createElement("button");

      elem.innerText = item;
      elem.onclick = () => {
        this.addToChips(item);
      };
      container.appendChild(elem);
      dom.appendChild(container);
    });
  }

  renderDom(dom) {
    let html = `
    <div class="ac-container">
    <div class="ac-chips ${this.color}">
    </div>
    <div class="ac ${this.color}">
    <div class="ac-header ${this.color} row justify-content-between">
    <div class='col-11'><input type="text" placeholder="${this.title}" /></div>
    <div class='col-1'> <i class="fas fa-chevron-down "></i></div>
    </div>
    <div class="ac-body ${this.color}">
    </div>
    </div>
    </div>`;

    dom.innerHTML = html;
  }

  generateInput() {
    //Création de l'input du dropdown
    const dom = document.querySelector(`${this.id} input`);
    dom.addEventListener("input", (e) => {
      const text = e.target.value;
      const arrow = document.querySelector(`${this.id} i`);

      this.text = text;
      if (!this.showList) {
        // affiche la liste lorsque l'on écrit du texte dans le dropdown
        this.toggleDropdown(arrow);
      }
      if (text === "" && this.showList) {
        this.toggleDropdown(arrow);
      }
      //tri
      this.filteredItems = this.getItems().filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      this.filteredItems = this.filteredItems.filter(
        (s) => !this.chips.find((c) => c === s)
      );

      this.generateList();
    });
  }

  toggleDropdown(e) {
    this.showList = !this.showList;
    e.style.transform = `rotate(${180 * +this.showList}deg)`;
    document.querySelector(`${this.id} .ac-body`).style.display = this.showList ?
      "flex" :
      "none";
  }

  generateDropdown() {
    const dom = document.querySelector(`${this.id} i`);

    dom.addEventListener("click", (e) => {
      this.toggleDropdown(e.target);
    });
  }

  render() {
    const dom = this.getDom();
    this.renderDom(dom);
    this.generateList();
    this.generateDropdown();
    this.generateInput();
  }
}

class Filters {
  constructor() {
    this.constraints = []

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

    this.ingredientsAutocomplete.setChipsEventFunction((constraints) => {
      this.appareilsAutocomplete.updateConstraints(constraints)
      this.ustensilesAutocomplete.updateConstraints(constraints)
    })

    this.appareilsAutocomplete.setChipsEventFunction((constraints) => {
      this.ingredientsAutocomplete.updateConstraints(constraints)
      this.ustensilesAutocomplete.updateConstraints(constraints)
    })

    this.ustensilesAutocomplete.setChipsEventFunction((constraints) => {
      this.ingredientsAutocomplete.updateConstraints(constraints)
      this.appareilsAutocomplete.updateConstraints(constraints)
    })
  }


  generateIngredientsList() {
    let ingredients = {}

    recipes.forEach((recipe, index) => {
      recipe.ingredients.forEach(ingredientObj => {
        const ingredient = ingredientObj.ingredient.toLowerCase()
        ingredients[ingredient] = ingredients[ingredient] || []
        ingredients[ingredient].push(index)
      })
    });
    return ingredients
  }

  generateApplianceList() {
    let appareils = {}

    recipes.forEach((recipe, index) => {
      const appareil = recipe.appliance.toLowerCase()
      appareils[appareil] = appareils[appareil] || []
      appareils[appareil].push(index)
    });
    return appareils
  }

  generateUstensilesList() {
    let ustensiles = {}

    recipes.forEach((recipe, index) => {
      recipe.ustensils.forEach(ustensile => {
        ustensile = ustensile.toLowerCase()
        ustensiles[ustensile] = ustensiles[ustensile] || []
        ustensiles[ustensile].push(index)
      })

    });
    return ustensiles
  }
}
