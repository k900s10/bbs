import { StringResourceLoader } from './services/StringResourceLoader.js';
import { AllocationChart } from './charts/AllocationChart.js';
import { ProgressChart } from './charts/ProgressChart.js';
import { HistoryChart } from './charts/HistoryChart.js';
import { ImpactCalculatorUI } from './ui/ImpactCalculatorUI.js';
import { AuditTableUI } from './ui/AuditTableUI.js';
import { NavigationUI } from './ui/NavigationUI.js';

/**
 * BBS Transparency Web Application
 * Application bootstrap and lifecycle coordinator.
 */
class App {
    static async init() {
        // 0. Load String Resources from assets/string.xml and bind to DOM
        await StringResourceLoader.load('assets/string.xml');
        StringResourceLoader.applyToDOM();

        // 1. Initialize UI Interactions & Navigation
        NavigationUI.init();

        const impactCalculator = new ImpactCalculatorUI({
            buttonContainerSelector: '#impact-btn-container',
            mealsSelector: '#impact-meals',
            descSelector: '#impact-desc',
            targetSelector: '#impact-target',
            defaultAmount: 20000
        });
        impactCalculator.init();

        const auditTable = new AuditTableUI('#audit-table-body');
        auditTable.render();

        // 2. Initialize Charts
        const allocationCanvas = document.getElementById('allocationChart');
        if (allocationCanvas) {
            const allocationChart = new AllocationChart(allocationCanvas);
            allocationChart.render();
        }

        const progressCanvas = document.getElementById('progressChart');
        if (progressCanvas) {
            const progressChart = new ProgressChart(progressCanvas);
            progressChart.render();
        }

        const historyCanvas = document.getElementById('historyChart');
        if (historyCanvas) {
            const historyChart = new HistoryChart(historyCanvas);
            historyChart.render();
        }
    }
}

// Bootstrap when DOM content is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
