import { ALLOCATION_DATA } from '../data/allocationData.js';
import { CURRENT_CAMPAIGN, MONTHLY_HISTORY } from '../data/historyData.js';

/**
 * DonationService
 * Handles donation data queries, statistical aggregations, and currency formatting.
 */
export class DonationService {
    /**
     * Get allocation data breakdown
     */
    static getAllocationData() {
        return ALLOCATION_DATA;
    }

    /**
     * Get current month campaign metrics
     */
    static getCurrentCampaign() {
        return CURRENT_CAMPAIGN;
    }

    /**
     * Get monthly historical audit records
     */
    static getMonthlyHistory() {
        return MONTHLY_HISTORY;
    }

    /**
     * Format number to standard Indonesian Rupiah currency string (e.g. "Rp 15.000.000")
     * @param {number} amount 
     * @returns {string}
     */
    static formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount).replace('IDR', 'Rp').trim();
    }

    /**
     * Format number to short Indonesian Rupiah string (e.g. "Rp 15.0Jt")
     * @param {number} amount 
     * @returns {string}
     */
    static formatShortCurrency(amount) {
        return `Rp ${(amount / 1000000).toFixed(1)}Jt`;
    }
}
