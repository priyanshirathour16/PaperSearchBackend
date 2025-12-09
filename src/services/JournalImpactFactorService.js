const journalImpactFactorRepository = require('../repositories/JournalImpactFactorRepository');
const journalRepository = require('../repositories/JournalRepository');

class JournalImpactFactorService {
    async addImpactFactors(journalId, factors) {
        // Validation: Check if journal exists
        const journal = await journalRepository.findById(journalId);
        if (!journal) {
            throw new Error('Journal not found');
        }

        const dataToCreate = factors.map(factor => ({
            journal_id: journalId,
            year: factor.year,
            impact_factor: factor.impact_factor || factor.impactFactor // handle potential casing
        }));

        return await journalImpactFactorRepository.bulkCreate(dataToCreate);
    }

    async getImpactFactorsByJournalId(journalId) {
        return await journalImpactFactorRepository.findByJournalId(journalId);
    }

    async deleteImpactFactor(id) {
        const deleted = await journalImpactFactorRepository.delete(id);
        if (!deleted) {
            throw new Error('Impact Factor not found');
        }
        return { message: 'Impact Factor deleted successfully' };
    }
}

module.exports = new JournalImpactFactorService();
