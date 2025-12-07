
import { calculatePackage } from './app/lib/calculations';
import { COMPANIES } from './app/lib/companies';
import { describe, it, expect } from 'bun:test';

describe('Calculation Logic', () => {
    it('should correctly calculate total present value', () => {
        const input = {
            baseSalary: 150000,
            bonusPercentage: 0.15, // 15%
            rsuGrantAmount: 400000, // 4 year total
            avgClosingPrice: 100, // Grant price
            currentStockPrice: 150, // Current price (+50%)
        };

        const result = calculatePackage(input);

        // Expected matches:
        // Cash: 150k * 1.15 = 172,500
        expect(result.cashComp).toBe(172500);

        // Shares: 400k / 100 = 4000 shares
        expect(result.rsuShares).toBe(4000);

        // Annual RSU Value: (4000 shares * 150) / 4 = 150,000
        expect(result.rsuCurrentValue).toBe(150000);

        // Total Present Value: 172,500 + 150,000 = 322,500
        expect(result.totalPresentValue).toBe(322500);

        // Gain/Loss
        // Annual Original Value: 400,000 / 4 = 100,000
        // Gain: 150,000 - 100,000 = 50,000
        expect(result.rsuGainLoss).toBe(50000);
        expect(result.rsuGainLossPercent).toBeCloseTo(50.0);
    });

    it('should handle negative stock performance', () => {
        const input = {
            baseSalary: 150000,
            bonusPercentage: 0.15,
            rsuGrantAmount: 400000,
            avgClosingPrice: 100,
            currentStockPrice: 50, // -50% drop
        };

        const result = calculatePackage(input);
        
        // Shares: 4000
        // Annual RSU Value: (4000 * 50) / 4 = 50,000
        expect(result.rsuCurrentValue).toBe(50000);
        
        // Annual Original: 100,000
        // Gain/Loss: 50,000 - 100,000 = -50,000
        expect(result.rsuGainLoss).toBe(-50000);
        expect(result.rsuGainLossPercent).toBeCloseTo(-50.0);
    });
});

describe('Company Configuration', () => {
    it('should have valid configuration for all companies', () => {
        expect(COMPANIES.length).toBeGreaterThan(0);
        
        COMPANIES.forEach(company => {
            expect(company.id).toBeDefined();
            expect(company.name).toBeDefined();
            expect(company.ticker).toBeDefined();
            expect(company.colors).toBeDefined();
            expect(company.colors.primary).toBeDefined();
        });
    });

    it('should include Meta, Google, and Amazon', () => {
        const ids = COMPANIES.map(c => c.id);
        expect(ids).toContain('meta');
        expect(ids).toContain('google');
        expect(ids).toContain('amazon');
    });
});
