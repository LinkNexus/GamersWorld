import { Controller } from '@hotwired/stimulus';

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class extends Controller {
    static targets = ['step', "previousButton"];

    static values = {
        currentStep: {
            type: Number,
            default: 1,
        }
    }

    declare stepTargets: HTMLElement[];
    declare currentStepValue: number;
    declare previousButtonTarget: HTMLButtonElement;
    private stepsOriginalStates: string[] = [];

    connect() {
        super.connect();
        this.initializeSteps();
        this.displayCurrentStep();
        this.previousButtonTarget.addEventListener('click', this.previousStep.bind(this));
    }

    initializeSteps() {
        console.log(this.stepTargets)
        this.stepTargets.forEach((target, index, targets) => {
            const dataController = target.dataset.controller;

            if (index !== targets.length - 1) {
                if (!target.querySelector('[data-disable-button-target = "button"]')) {
                    this.appendButtonToElement(target);
                }

                if (!dataController)
                    target.dataset.controller = 'disable-button';
                else if (dataController !== 'disable-button')
                    target.dataset.controller = `${dataController} disable-button`;
            }

            this.stepsOriginalStates[index] = target.style.display || 'block';
        })
    }

    appendButtonToElement(element: HTMLElement) {
        const button = document.createElement('button');
        button.setAttribute('data-disable-button-target', 'button');
        button.setAttribute('type', 'button');
        button.textContent = 'Next Step';
        button.classList.add("w-full", "button-primary")
        button.setAttribute('data-action', 'modal--multiple-steps#nextStep');
        element.appendChild(button);

        return button;
    }

    previousStep() {
        if (this.currentStepValue <= 1) return;
        this.currentStepValue -= 1;
    }

    nextStep() {
        if (this.currentStepValue >= this.stepTargets.length) return;
        this.currentStepValue += 1;
    }

    displayCurrentStep() {
        this.stepTargets.forEach((target, index) => {
            if (index === this.currentStepValue - 1)
                target.style.display = this.stepsOriginalStates[this.currentStepValue - 1];
            else target.style.display = 'none';
        })

        this.previousButtonTarget.style.display = this.currentStepValue === 1 ? 'none' : 'inline-flex';
    }

    currentStepValueChanged(value: number, previousValue: number) {
        if (previousValue === undefined) return;
        this.displayCurrentStep();
    }
}
