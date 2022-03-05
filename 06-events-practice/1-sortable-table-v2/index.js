export default class SortableTable {
  subElements;

  onSortClick = event => {
      const sortableColumn = event.target.closest('[data-sortable="true"]');
      if (!sortableColumn) return;

      const newOrder = sortableColumn.dataset.order === "asc" ? "desc" : "asc";
      const id = sortableColumn.dataset.id;
      const sortedData = this.sortData(id, newOrder);
      const arrow = sortableColumn.querySelector('.sortable-table__sort-arrow');
      
      sortableColumn.dataset.order = newOrder;

      if (!arrow) sortableColumn.append(this.subElements.arrow);

      this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  constructor(headerConfig = [], { data = [], sorted = {} } = {}) {

    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
  }

  getTable(sortedData, id, order) {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getHeaderRow(id, order)}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this.getTableRows(sortedData)}
          </div>`
  }

  render() {
    const { id, order } = this.sorted;
    const sortedData = this.sortData(id, order);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable(sortedData, id, order);

    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();

    this.initEventListener();
  }

  initEventListener() {
    this.subElements.header.addEventListener("pointerdown", this.onSortClick);
  }

  sortData(field, order) {
    const sortableColumnConfig = this.headerConfig.find(column => column.id === field);
    const sortType = sortableColumnConfig.sortType;

    const directions = {
      asc: 1,
      desc: -1,
    }

    const direction = directions[order];
    
    return this.data.sort((value1, value2) => {
      switch (sortType) {
        case "number":
          return direction * (value1[field] - value2[field]);
        case "string":
          return direction * (value1[field].localeCompare(value2[field], ['ru', 'en']));
        default : 
          return direction * (value1[field] - value2[field]);
      }
    });
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
    // NOTE: удаляем обработчики событий, если они есть
  }

  getHeaderRow(id, order) {
    console.log(id)
    console.log(order)
    if (this.headerConfig) return this.headerConfig.map(headerCell => {
      return `
        <div class="sortable-table__cell" data-id=${headerCell.id} data-sortable=${headerCell.sortable} data-order=${headerCell.id === id ? order : ""}>
          <span>${headerCell.title}</span>
          ${headerCell.id === id ? 
            `<span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>`: ""
          }
        </div> `
    }).join("");
  }

  getTableRows(data = this.data) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getTableRow(item)}
        </a>`;
    }).join("");
  }

  getTableRow(item) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template,
      };
    });

      return cells.map(({id, template}) => {
        return template 
          ? template(item[id])
          : `<div class="sortable-table__cell">${item[id]}</div>`;
      }).join("");
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');
    elements.forEach(subElem => {
        const name = subElem.dataset.element;
        result[name] = subElem;
    })
    return result;
  }

}

