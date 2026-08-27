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
        const labels = allocationData.map(item => `${item.label} (${item.percentage}%)`);
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
                    borderColor: '#ffffff',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '62%',
                layout: {
                    padding: {
                        top: 6,
                        bottom: 12,
                        left: 8,
                        right: 8
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        align: 'center',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 8,
                            boxHeight: 8,
                            padding: 20,
                            font: { 
                                family: ChartService.FONT_FAMILY, 
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}`;
                            }
                        }
                    }
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
