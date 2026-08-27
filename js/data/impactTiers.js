/**
 * Impact Calculator Tiers & Constants
 * Defines predefined donation impact tiers and standard cost parameters.
 */
export const BASE_MEAL_COST = 20000;

export const IMPACT_TIERS = [
    {
        amount: 20000,
        buttonLabel: 'Rp 20.000',
        meals: '1 Porsi Lengkap',
        description: 'Olahan Pangan Lokal & Nutrisi Seimbang',
        targetRecipient: '1 Orang / Warga Membutuhkan'
    },
    {
        amount: 50000,
        buttonLabel: 'Rp 50.000',
        meals: '2,5 Porsi Lengkap',
        description: 'Sajian Kuliner Nusantara Sehat & Bergizi',
        targetRecipient: '2-3 Warga Membutuhkan'
    },
    {
        amount: 100000,
        buttonLabel: 'Rp 100.000',
        meals: '5 Porsi Lengkap',
        description: 'Paket Sajian Pangan Lokal Nusantara Komplit',
        targetRecipient: '5 Orang / 1 Keluarga Rentan'
    }
];
