import { DonationService } from '../services/DonationService.js';
import { ChartService } from './ChartService.js';

/**
 * ProgressChart
 * Manages rendering of the monthly fundraising target progress chart.
 */
export class ProgressChart {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.chartInstance = null;
    }

    render() {
        if (!this.canvas) return null;
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        const campaign = DonationService.getCurrentCampaign();
        const labels = [ChartService.wrapLabel(`Bulan ${campaign.month}`, 16)];

        const ctx = this.canvas.getContext('2d');
        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `Terkumpul (${DonationService.formatCurrency(campaign.collectedAmount)})`,
                        data: [campaign.collectedAmount],
                        backgroundColor: '#059669',
                        borderRadius: 6
                    },
                    {
                        label: `Sisa Target (${DonationService.formatCurrency(campaign.remainingAmount)})`,
                        data: [campaign.remainingAmount],
                        backgroundColor: '#ffedd5',
                        borderColor: '#ea580c',
                        borderWidth: 1,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        max: campaign.targetAmount,
                        ticks: {
                            callback: function(value) {
                                return DonationService.formatShortCurrency(value);
                            },
                            font: { family: ChartService.FONT_FAMILY, size: 10 }
                        }
                    },
                    y: {
                        stacked: true,
                        display: false
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { family: ChartService.FONT_FAMILY, size: 11 } }
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
