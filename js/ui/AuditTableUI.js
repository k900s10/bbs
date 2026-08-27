import { DonationService } from '../services/DonationService.js';

/**
 * AuditTableUI
 * Dynamically renders transparency audit table rows from the data service.
 */
export class AuditTableUI {
    constructor(tbodySelector = '#audit-table-body') {
        this.tbody = document.querySelector(tbodySelector);
    }

    render() {
        if (!this.tbody) return;

        const records = DonationService.getMonthlyHistory();
        this.tbody.innerHTML = '';

        records.forEach(record => {
            const tr = document.createElement('tr');
            if (record.isCurrent) {
                tr.className = 'bg-emerald-50/50 font-bold';
                tr.innerHTML = `
                    <td class="p-3 text-emerald-950">${record.period}</td>
                    <td class="p-3 text-emerald-700">${DonationService.formatCurrency(record.totalCollected)}</td>
                    <td class="p-3 text-slate-600">${DonationService.formatCurrency(record.allocationRantangKasih)}</td>
                    <td class="p-3 text-emerald-900">${record.portionsDelivered}</td>
                    <td class="p-3 text-emerald-800">${DonationService.formatCurrency(record.balance)}</td>
                `;
            } else {
                tr.className = 'hover:bg-slate-50/80';
                tr.innerHTML = `
                    <td class="p-3 font-semibold text-slate-900">${record.period}</td>
                    <td class="p-3 text-emerald-700 font-medium">${DonationService.formatCurrency(record.totalCollected)}</td>
                    <td class="p-3 text-slate-600">${DonationService.formatCurrency(record.allocationRantangKasih)}</td>
                    <td class="p-3 font-semibold text-slate-800">${record.portionsDelivered}</td>
                    <td class="p-3 text-slate-500">${DonationService.formatCurrency(record.balance)}</td>
                `;
            }
            this.tbody.appendChild(tr);
        });
    }
}
