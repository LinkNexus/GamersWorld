import {Controller} from '@hotwired/stimulus';
import {Modal} from "flowbite";

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class extends Controller<HTMLElement> {
    static values = {
        multipleSteps: {
            type: Boolean,
            default: false
        },
        title: String,
        id: String,
        initiallyVisible: {
            type: Boolean,
            default: false
        },
        static: {
            type: Boolean,
            default: false
        },
        isRendered: {
            type: Boolean,
            default: false
        }
    }

    declare readonly multipleStepsValue: boolean;
    declare readonly titleValue: string;
    declare idValue: string;
    declare readonly initiallyVisibleValue: boolean;
    declare readonly staticValue: boolean;
    declare isRenderedValue: boolean;

    connect() {
        if (this.element.dataset.rendered !== 'true') {
            this.render();
            this.initModal();
        }
    }

    render() {
        const previousButton = this.multipleStepsValue ? '<button type="button" class="start-2.5 text-theme-primary bg-transparent hover:bg-theme-primary hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modals--multiple-steps-target="previousButton">\n' +
            '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" aria-hidden="true" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 12H4m0 0l6-6m-6 6l6 6"/></svg>\n' +
            '<span class="sr-only">Previous Step</span>\n' +
            '</button>' : '';

        this.element.innerHTML = `<div class="relative p-4 w-full max-w-xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-black border border-theme-primary rounded-lg shadow-lg">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                ${previousButton}
                <h3 class="title text-4xl">
                    ${this.titleValue}
                </h3>
                <button type="button" class="end-2.5 text-theme-primary bg-transparent hover:bg-theme-primary hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="${this.idValue}-modal">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" aria-hidden="true" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M5.47 5.47a.75.75 0 0 1 1.06 0l12 12a.75.75 0 1 1-1.06 1.06l-12-12a.75.75 0 0 1 0-1.06"/><path d="M18.53 5.47a.75.75 0 0 1 0 1.06l-12 12a.75.75 0 0 1-1.06-1.06l12-12a.75.75 0 0 1 1.06 0"/></g></svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5">
                ${this.element.innerHTML}
            </div>
        </div>
    </div>`;

        this.isRenderedValue = true;
        this.addAttributes();
    }

    addAttributes() {
        this.element.setAttribute('id', this.idValue + '-modal');
        this.element.setAttribute('tabindex', '-1');
        this.element.setAttribute('aria-hidden', 'true');
        this.element.classList.add("hidden", "overflow-y-auto", "overflow-x-hidden", "fixed", "top-0", "right-0", "left-0", "z-50", "justify-center", "items-center", "w-full", "md:inset-0", "h-[calc(100%-1rem)]", "max-h-full", "modal");
        this.element.style.background = 'rgba(0, 0, 0, 0.8)';

        console.log(this.staticValue, this.initiallyVisibleValue)

        if (this.staticValue) {
            this.element.setAttribute('data-modal-backdrop', 'static');
        }

        if (this.multipleStepsValue) {
            this.element.setAttribute('data-controller', this.element.getAttribute('data-controller') + ' modals--multiple-steps');
        }
    }

    initModal() {
        const modal = new Modal(this.element);

        if (this.initiallyVisibleValue) {
            modal.show();
        }
    }
}
