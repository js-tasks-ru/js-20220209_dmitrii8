export default class ColumnChart {
    subElements = {};
    chartHeight = 50;

    _removeLoading() {
        if (this.data.length) {
            this.element.classList.remove('column-chart_loading');
        }
    }

    constructor({
        data = [],
        label = '',
        link = '',
        value = 0,
        formatHeading = data => data
    } = {}) {

        this.data = data;
        this.label = label;
        this.value = formatHeading(value);
        this.link = link;

        this.render();
        // this.initEventListeners();
    }

    getTemplate() {
        return `
        <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title"> ${this.label}
            ${this.getLink()}
            </div>
            <div class="column-chart__container"> 
                <div data-element="header" class="column-chart__header">
                    ${this.value}
                </div>
                <div data-element="body" class="column-chart__chart">
                    ${this.getColumnBody()}
            </div>
            </div>
        </div>
    `
    }

    render() {
        const element = document.createElement('div'); // (*)
        element.innerHTML = this.getTemplate();

        // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
        // который мы создали на строке (*)
        this.element = element.firstElementChild;

        this._removeLoading();

        this.subElements = this.getSubElements();
    }

    // initEventListeners() {
    //     // NOTE: в данном методе добавляем обработчики событий, если они есть
    // }

    remove() {
        if (this.element) {
            this.element.remove();
        }
    }

    destroy() {
        this.remove();
        // NOTE: удаляем обработчики событий, если они есть
    }

    getColumnBody() {
        const maxValue = Math.max(...this.data);
        const scale = this.chartHeight / maxValue;
        return this.data.map(item => {
            const percent = (item / maxValue * 100).toFixed(0);

            return `<div style="--value: ${Math.floor(item * scale)} " data-tooltip="${percent}%"></div>`;
        }).join('');
    }

    getLink() {
        if (this.link) {
            return `<a href=${this.link} class="column-chart__link">View all</a>`;
        }
        else {
            return "";
        }
    }

    update(data) {
        this.data = data;
        this.subElements.body.innerHTML = this.getColumnBody();
        this._removeLoading()
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



