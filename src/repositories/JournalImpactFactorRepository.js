const JournalImpactFactor = require('../models/JournalImpactFactor');

class JournalImpactFactorRepository {
    async bulkCreate(data) {
        return await JournalImpactFactor.bulkCreate(data);
    }

    async findByJournalId(journalId) {
        return await JournalImpactFactor.findAll({
            where: { journal_id: journalId },
            order: [['year', 'DESC']]
        });
    }

    async delete(id) {
        return await JournalImpactFactor.destroy({ where: { id } });
    }
}

module.exports = new JournalImpactFactorRepository();
