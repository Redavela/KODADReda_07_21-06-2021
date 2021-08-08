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
    this.chipsEventFunction = null;
    this.showList = false;

    this.render();
  }

  setChipsEventFunction(fn) {
    this.chipsEventFunction = fn;
  }

  getItems() {
    let keys = [];
    if (this.constraints.length === 0) {
      console.log(this.items, 'ici')
      return Object.keys(this.items);
    }
    // trie sur les recettes qu'on a spécifié
    for (const item in this.items) {
      if (this.chips.length > 0) {
        if (!this.chips.includes(item)) {
          if (
            this.constraints.some((e) => this.items[item].includes(e)) 
          ) {
            keys.push(item);
          }
        }
      } else {
        if (
          this.constraints.every((e) => this.items[item].includes(e))
        ) {
          keys.push(item);
        }
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
    // N affiche que les éléments qui sont présents dans la liste des recettes specifiées
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

  getChipsConstraints() {
    if (this.chips.length === 0) {
      return [];
    }

    return this.chips
      .map((item) => this.items[item])
      .reduce((c, v) => c.concat(v));
  }

  getConstraints(chips) {
    let chipsConstraints = chips.map((chip) => this.items[chip]) || [];
    if (chipsConstraints.length === 0) {
      return [];
    }
    return [...new Set(chipsConstraints.reduce((a, e) => a.concat(e)))];
  }

  addToChips(label) {
    this.chips.push(label);
    let chipsConstraints = this.chips.map((chip) => this.items[chip]) || [];

    // recuperer la taille des contraintes recupérér 
    let nbConstraints = chipsConstraints.length;

    // on fait un seul tableau avec notre tableau de tableau (chipsConstraints)
    // [1, 22, 22, 5, ]
    let countConstraints = {};
    for(const num of chipsConstraints.flat()){
      countConstraints[num] = countConstraints[num] ? countConstraints[num] + 1 : 1;
    }
    let arrayConstraints = [];
    
    console.log(Object.entries(countConstraints))
    for(const [idConstraint, nbcount] of Object.entries(countConstraints)) {
    // console.log(idConstraint, nbcount)
    if(nbcount === nbConstraints) {
      // console.log(idConstraint)
      arrayConstraints = [...arrayConstraints, +idConstraint]
    }
    }
    this.constraints = arrayConstraints;
    // compter le nombre qu'on récupère les elements []

    console.log(arrayConstraints)

    this.chipsEventFunction(
      this.constraints,
      [],
      "add"
    );
    console.log(this.constraints)
    this.filteredItems = this.getItems();

    this.generateChips();
    this.generateList();
  }

  addToList(label) {
    this.chips.splice(this.chips.indexOf(label), 1);
    let chipsConstraints = this.chips.map((chip) => this.items[chip]) || [];
    console.log(chipsConstraints);
    let nbConstraints = chipsConstraints.length;

    let countConstraints = {};
    for(const num of chipsConstraints.flat()){
      countConstraints[num] = countConstraints[num] ? countConstraints[num] + 1 : 1;
    }
    let arrayConstraints = [];    
    for(const [idConstraint, nbcount] of Object.entries(countConstraints)) {
      if(nbcount === nbConstraints) {
        arrayConstraints = [...arrayConstraints, +idConstraint]
      }
    }
    this.constraints = arrayConstraints;
    this.chipsEventFunction(
      this.constraints,
      [],
      "add"
    );
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
    document.querySelector(`${this.id} .ac-body`).style.display = this.showList
      ? "flex"
      : "none";
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
