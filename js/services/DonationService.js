import { supabase } from '../config/supabase.js';

/**
 * DonationService
 * Coordinates live data synchronization with Supabase.
 */
export class DonationService {
    static _allocations = [];
    static _currentCampaign = {
        month: '',
        targetAmount: 0,
        collectedAmount: 0,
        get remainingAmount() {
            return Math.max(0, this.targetAmount - this.collectedAmount);
        }
    };
    static _monthlyHistory = [];
    static _isInitialized = false;

    /**
     * Fetch all remote data from Supabase in parallel
     */
    static async fetchAllData(programId = 'rantang-kasih') {
        try {
            const [allocRes, campRes, auditRes] = await Promise.allSettled([
                supabase
                    .from('budget_allocations')
                    .select('*')
                    .eq('program_id', programId)
                    .order('display_order', { ascending: true }),
                supabase
                    .from('campaigns')
                    .select('*')
                    .eq('program_id', programId)
                    .eq('is_current', true)
                    .maybeSingle(),
                supabase
                    .from('monthly_audits')
                    .select('*')
                    .eq('program_id', programId)
                    .order('display_order', { ascending: true })
            ]);

            // 1. Process Budget Allocations
            if (allocRes.status === 'fulfilled' && allocRes.value.data && allocRes.value.data.length > 0) {
                this._allocations = allocRes.value.data.map(item => ({
                    label: item.label,
                    percentage: Number(item.percentage),
                    color: item.color
                }));
            }

            // 2. Process Current Campaign Metrics
            if (campRes.status === 'fulfilled' && campRes.value.data) {
                const c = campRes.value.data;
                this._currentCampaign = {
                    month: c.period_name,
                    targetAmount: Number(c.target_amount),
                    collectedAmount: Number(c.collected_amount),
                    get remainingAmount() {
                        return Math.max(0, this.targetAmount - this.collectedAmount);
                    }
                };
            }

            // 3. Process Monthly Transparency Audits
            if (auditRes.status === 'fulfilled' && auditRes.value.data && auditRes.value.data.length > 0) {
                this._monthlyHistory = auditRes.value.data.map(item => ({
                    period: item.period,
                    totalCollected: Number(item.total_collected),
                    allocationRantangKasih: Number(item.total_disbursed),
                    portionsDelivered: item.impact_summary,
                    balance: Number(item.balance !== undefined ? item.balance : (item.total_collected - item.total_disbursed)),
                    isCurrent: Boolean(item.is_current)
                }));
            }

            this._isInitialized = true;
        } catch (err) {
            console.error('[DonationService] Error syncing live data from Supabase:', err);
        }
    }

    /**
     * Get allocation data breakdown
     */
    static getAllocationData() {
        return this._allocations;
    }

    /**
     * Get current month campaign metrics
     */
    static getCurrentCampaign() {
        return this._currentCampaign;
    }

    /**
     * Get monthly historical audit records
     */
    static getMonthlyHistory() {
        return this._monthlyHistory;
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
