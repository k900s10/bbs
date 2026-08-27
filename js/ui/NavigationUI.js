/**
 * NavigationUI
 * Handles smooth scrolling and navigation actions across the page.
 */
export class NavigationUI {
    /**
     * Scroll smoothly to the audit table element
     * @param {string} targetSelector 
     */
    static scrollTo(targetSelector = '#audit-table') {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
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
                NavigationUI.scrollTo('#audit-table');
            });
        });
    }
}
