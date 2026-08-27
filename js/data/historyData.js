/**
 * Historical and Current Campaign Data
 * Defines monthly progress and historical transparency audit records.
 */

export const CURRENT_CAMPAIGN = {
    month: 'Agustus 2026',
    targetAmount: 15000000,
    collectedAmount: 11250000,
    get remainingAmount() {
        return Math.max(0, this.targetAmount - this.collectedAmount);
    }
};

export const MONTHLY_HISTORY = [
    {
        period: 'Mei 2026',
        totalCollected: 12500000,
        allocationRantangKasih: 12000000,
        portionsDelivered: '600 Porsi Pangan Lokal',
        balance: 500000,
        isCurrent: false
    },
    {
        period: 'Juni 2026',
        totalCollected: 14200000,
        allocationRantangKasih: 14000000,
        portionsDelivered: '700 Porsi Pangan Lokal',
        balance: 700000,
        isCurrent: false
    },
    {
        period: 'Juli 2026',
        totalCollected: 16000000,
        allocationRantangKasih: 15500000,
        portionsDelivered: '775 Porsi Pangan Lokal',
        balance: 1000000,
        isCurrent: false
    },
    {
        period: 'Agustus 2026 (Berjalan)',
        totalCollected: 11250000,
        allocationRantangKasih: 10000000,
        portionsDelivered: '500 Porsi (Progres)',
        balance: 2250000,
        isCurrent: true
    }
];
