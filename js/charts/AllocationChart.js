import { DonationService } from '../services/DonationService.js';
import { ChartService } from './ChartService.js';

/**
 * AllocationChart
 * Manages rendering of the Rantang Kasih budget allocation doughnut chart.
 */
export class AllocationChart {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.chartInstance = null;
    }

    render() {
        if (!this.canvas) return null;
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        const allocationData = DonationService.getAllocationData();
        const labels = allocationData.map(item => ChartService.wrapLabel(item.label, 16));
        const data = allocationData.map(item => item.percentage);
        const backgroundColor = allocationData.map(item => item.color);

        const ctx = this.canvas.getContext('2d');
        this.chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColor,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: ChartService.FONT_FAMILY, size: 11 },
                            boxWidth: 12
                        }
                    },
                    tooltip: ChartService.getStandardTooltipConfig()
                }
            }
        });

        return this.chartInstance;
    }

    destroy() {
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    }
}
