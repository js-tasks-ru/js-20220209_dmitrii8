export default class NotificationMessage {
    static previousNotification;

    constructor(message = "", {
        duration = 0,
        type = "",
    } = {}) {

        this.message = message;
        this.duration = duration;
        this.type = type;
        this.render();
    }

    getTemplate() {
        return `
            <body>
                <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
                    <div class="timer"></div>
                    <div class="inner-wrapper">
                        <div class="notification-header">${this.type}</div>
                        <div class="notification-body">
                            ${this.message}
                        </div>
                    </div>
                </div>
            </body>
        `
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTemplate();

        this.element = wrapper.firstElementChild;
    }

    destroy() {
        this.remove();
        // NOTE: удаляем обработчики событий, если они есть
    }

    remove() {
        if (this.element) {
            this.element.remove();
        }
    }

    show(target = document.body) {

        if (NotificationMessage.previousNotification) {
            NotificationMessage.previousNotification.remove();
        }

        target.append(this.element);
        setTimeout(this.remove.bind(this), this.duration);

        NotificationMessage.previousNotification = this;
    }
}
