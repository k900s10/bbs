import { ImpactService } from '../services/ImpactService.js';

/**
 * ImpactCalculatorUI
 * Handles DOM interactions, button state management, and display updates for the impact calculator.
 */
export class ImpactCalculatorUI {
    static ACTIVE_CLASS = 'bg-emerald-500 text-white border-emerald-400';
    static INACTIVE_CLASS = 'bg-white/10 hover:bg-white/20 text-white border-white/10';

    constructor({ buttonContainerSelector, mealsSelector, descSelector, targetSelector, defaultAmount = 20000 }) {
        this.buttonContainer = document.querySelector(buttonContainerSelector);
        this.mealsElement = document.querySelector(mealsSelector);
        this.descElement = document.querySelector(descSelector);
        this.targetElement = document.querySelector(targetSelector);
        this.currentAmount = defaultAmount;
    }

    init() {
        if (!this.buttonContainer) return;
        this.renderButtons();
        this.bindEvents();
        this.updateImpact(this.currentAmount);
    }

    renderButtons() {
        const tiers = ImpactService.getTiers();
        this.buttonContainer.innerHTML = '';

        tiers.forEach(tier => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.amount = tier.amount.toString();
            btn.id = `btn-${tier.amount / 1000}k`;
            btn.className = `calc-btn font-bold py-2 rounded-xl text-xs transition border ${
                tier.amount === this.currentAmount ? ImpactCalculatorUI.ACTIVE_CLASS : ImpactCalculatorUI.INACTIVE_CLASS
            }`;
            btn.textContent = tier.buttonLabel;
            this.buttonContainer.appendChild(btn);
        });
    }

    bindEvents() {
        this.buttonContainer.addEventListener('click', (event) => {
            const button = event.target.closest('button[data-amount]');
            if (!button) return;

            const amount = parseInt(button.dataset.amount, 10);
            if (!isNaN(amount)) {
                this.updateImpact(amount);
            }
        });
    }

    updateImpact(amount) {
        this.currentAmount = amount;
        const result = ImpactService.calculateImpact(amount);

        if (this.mealsElement) this.mealsElement.textContent = result.meals;
        if (this.descElement) this.descElement.textContent = result.description;
        if (this.targetElement) this.targetElement.textContent = result.targetRecipient;

        // Update button active state classes
        const buttons = this.buttonContainer.querySelectorAll('button[data-amount]');
        buttons.forEach(btn => {
            const btnAmount = parseInt(btn.dataset.amount, 10);
            btn.className = `calc-btn font-bold py-2 rounded-xl text-xs transition border ${
                btnAmount === amount ? ImpactCalculatorUI.ACTIVE_CLASS : ImpactCalculatorUI.INACTIVE_CLASS
            }`;
        });
    }
}
