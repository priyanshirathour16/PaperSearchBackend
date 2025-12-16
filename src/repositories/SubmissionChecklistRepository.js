const SubmissionChecklist = require('../models/SubmissionChecklist');

class SubmissionChecklistRepository {
    async create(data, transaction = null) {
        return await SubmissionChecklist.create(data, { transaction });
    }

    async findByManuscriptId(manuscriptId) {
        return await SubmissionChecklist.findOne({
            where: { manuscript_id: manuscriptId }
        });
    }

    async update(manuscriptId, data) {
        return await SubmissionChecklist.update(data, {
            where: { manuscript_id: manuscriptId }
        });
    }

    async delete(manuscriptId) {
        return await SubmissionChecklist.destroy({
            where: { manuscript_id: manuscriptId }
        });
    }
}

module.exports = new SubmissionChecklistRepository();
