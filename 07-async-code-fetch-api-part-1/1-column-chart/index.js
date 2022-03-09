import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    subElements = {};
    chartHeight = 50;
    data = [];

    constructor({
        url = '',
        range = {
            from : new Date(),
            to : new Date(),
        },
        label = '',
        link = '',
        formatHeading = data => data
    } = {}) {
        
        this.url = new URL(url, BACKEND_URL);
        this.range = range;
        this.label = label;
        this.link = link;
        this.formatHeading = formatHeading;
        
        this.render();
        this.update(this.range.from, this.range.to)
    }


    async update(from, to) {
        const data = await this.loadData(from, to);

        if (data) {
            this.subElements.header.innerHTML = this.getHeaderValue(data);
            this.subElements.body.innerHTML = this.getColumnBody(data);
            this.element.classList.remove('column-chart_loading')
        }
        
        this.data = data;
        return(this.data)
    }
    

    async loadData (from, to) {
        this.url.searchParams.set("from", from.toISOString());
        this.url.searchParams.set("to", to.toISOString());
        return await fetchJson(this.url);
    }

    getTemplate() {
        return `
        <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title"> ${this.label}
            ${this.getLink()}
            </div>
            <div class="column-chart__container"> 
                <div data-element="header" class="column-chart__header"></div>
                <div data-element="body" class="column-chart__chart"></div>
            </div>
        </div>`
    }

    render() {
        const element = document.createElement('div'); 
        element.innerHTML = this.getTemplate();

        this.element = element.firstElementChild;
        this.subElements = this.getSubElements();
    }

    getHeaderValue(data) {
        return this.formatHeading(Object.values(data).reduce((previousItem, item) => (previousItem + item), 0));
    }

    remove() {
        if (this.element) {
            this.element.remove();
        }
    }

    destroy() {
        this.remove();
        this.element = null;
    }

    getColumnBody(data) {
        data = Object.values(data);
        const maxValue = Math.max(...data);
        const scale = this.chartHeight / maxValue;
        return data.map(item => {
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
