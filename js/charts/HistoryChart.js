import { DonationService } from '../services/DonationService.js';
import { ChartService } from './ChartService.js';

/**
 * HistoryChart
 * Manages rendering of the multi-month historical transparency bar chart.
 */
export class HistoryChart {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.chartInstance = null;
    }

    render() {
        if (!this.canvas) return null;
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        const historyData = DonationService.getMonthlyHistory();
        const labels = historyData.map(item => ChartService.wrapLabel(item.period.replace(' (Berjalan)', ''), 16));
        const collectedData = historyData.map(item => item.totalCollected);
        const distributedData = historyData.map(item => item.allocationRantangKasih);
        const balanceData = historyData.map(item => item.balance);

        const ctx = this.canvas.getContext('2d');
        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Donasi Masuk',
                        data: collectedData,
                        backgroundColor: '#059669',
                        borderRadius: 4
                    },
                    {
                        label: 'Dana Disalurkan (Rantang Kasih)',
                        data: distributedData,
                        backgroundColor: '#0284c7',
                        borderRadius: 4
                    },
                    {
                        label: 'Sisa Saldo Kas',
                        data: balanceData,
                        backgroundColor: '#cbd5e1',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return DonationService.formatShortCurrency(value);
                            },
                            font: { family: ChartService.FONT_FAMILY, size: 10 }
                        }
                    },
                    x: {
                        ticks: { font: { family: ChartService.FONT_FAMILY, size: 10 } }
                    }
                },
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
