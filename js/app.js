import { StringResourceLoader } from './services/StringResourceLoader.js';
import { DonationService } from './services/DonationService.js';
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
        // 0. Load String Resources and Live Supabase Data concurrently
        await Promise.all([
            StringResourceLoader.load('assets/string.xml'),
            DonationService.fetchAllData('rantang-kasih')
        ]);
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

        // 3. Update Progress Summary Stats dynamically from live campaign
        const currentCampaign = DonationService.getCurrentCampaign();
        if (currentCampaign.month) {
            const targetEl = document.getElementById('progress-target-val');
            const collectedEl = document.getElementById('progress-collected-val');
            const remainingEl = document.getElementById('progress-remaining-val');

            if (targetEl) targetEl.textContent = DonationService.formatCurrency(currentCampaign.targetAmount);
            if (collectedEl) collectedEl.textContent = DonationService.formatCurrency(currentCampaign.collectedAmount);
            if (remainingEl) remainingEl.textContent = DonationService.formatCurrency(currentCampaign.remainingAmount);
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
