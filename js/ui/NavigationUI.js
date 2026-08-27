/**
 * NavigationUI
 * Handles smooth scrolling and navigation actions across the page.
 */
export class NavigationUI {
    /**
     * Scroll smoothly to target element
     * @param {string} targetSelector 
     * @param {ScrollLogicalPosition} blockPosition - 'center' | 'start' | 'nearest'
     */
    static scrollTo(targetSelector = '#audit-table', blockPosition = 'start') {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: blockPosition
            });
        }
    }

    /**
     * Initialize navigation trigger event bindings
     */
    static init() {
        const auditButtons = document.querySelectorAll('[data-action="view-audit"]');
        auditButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                NavigationUI.scrollTo('#audit-table', 'start');
            });
        });

        // Handle header CTA button to smoothly center kalkulator-dampak
        const ctaButtons = document.querySelectorAll('a[href="#kalkulator-dampak"]');
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                NavigationUI.scrollTo('#kalkulator-dampak', 'center');
            });
        });
    }
}

