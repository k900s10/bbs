import { BASE_MEAL_COST, IMPACT_TIERS } from '../data/impactTiers.js';

/**
 * ImpactService
 * Handles impact calculation logic (Single Responsibility: Business calculation of impact metrics).
 */
export class ImpactService {
    /**
     * Get all predefined impact tiers
     * @returns {Array}
     */
    static getTiers() {
        return IMPACT_TIERS;
    }

    /**
     * Calculate impact details for a given donation amount
     * @param {number} amount
     * @returns {Object} Impact calculation result
     */
    static calculateImpact(amount) {
        const foundTier = IMPACT_TIERS.find(tier => tier.amount === amount);
        if (foundTier) {
            return {
                amount: foundTier.amount,
                meals: foundTier.meals,
                description: foundTier.description,
                targetRecipient: foundTier.targetRecipient
            };
        }

        // Fallback dynamic calculation for arbitrary donation amount
        const portions = (amount / BASE_MEAL_COST).toFixed(1).replace('.0', '');
        return {
            amount: amount,
            meals: `${portions} Porsi Lengkap`,
            description: 'Olahan Pangan Lokal & Nutrisi Seimbang',
            targetRecipient: `${Math.max(1, Math.floor(amount / BASE_MEAL_COST))} Orang / Warga Membutuhkan`
        };
    }
}
