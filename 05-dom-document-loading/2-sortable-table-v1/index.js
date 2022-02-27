export default class SortableTable {
  subElements;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data // Array.isArray(data) ? data : data.data;

    this.render();
  }

  getTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getHeaderRow()}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this.getTableRows()}
          </div>`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }

  sort(field, order) {
    const sortableColumn = this.headerConfig.find(column => column.id === field);
    const sortType = sortableColumn.sortType;
    const directions = {
      asc: 1,
      desc: -1,
    }

    const direction = directions[order];
    
    const sortedData = this.data.sort((value1, value2) => {
      switch (sortType) {
        case "number":
          return direction * (value1[field] - value2[field]);
        case "string":
          return direction * (value1[field].localeCompare(value2[field], ['ru', 'en']));
        default : 
          return direction * (value1[field] - value2[field]);
      }
    })

    this.subElements.body.innerHTML = this.getTableRows(sortedData);

    const allColumns = this.subElements.header.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.subElements.header.querySelector(`.sortable-table__cell[data-id=${field}]`);
    
    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;
  }

  getHeaderRow() {
    if (this.headerConfig) return this.headerConfig.map(headerCell => {
      return `
        <div class="sortable-table__cell" data-id=${headerCell.id} data-sortable=${headerCell.sortable}>
          <span>${headerCell.title}</span>
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
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

