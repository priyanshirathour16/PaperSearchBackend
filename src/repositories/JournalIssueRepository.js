const JournalIssue = require('../models/JournalIssue');
const Journal = require('../models/Journal');

class JournalIssueRepository {
    async create(issueData) {
        return await JournalIssue.create(issueData);
    }

    async findAll() {
        return await JournalIssue.findAll({
            include: [{
                model: Journal,
                as: 'journal',
                attributes: ['id', 'title'],
            }],
            order: [['year', 'DESC'], ['volume', 'DESC'], ['issue_no', 'DESC']],
        });
    }

    async findById(id) {
        return await JournalIssue.findByPk(id, {
            include: [{
                model: Journal,
                as: 'journal',
                attributes: ['id', 'title'],
            }],
        });
    }

    async update(id, issueData) {
        const issue = await JournalIssue.findByPk(id);
        if (!issue) {
            return null;
        }
        return await issue.update(issueData);
    }

    async delete(id) {
        const issue = await JournalIssue.findByPk(id);
        if (!issue) {
            return null;
        }
        await issue.destroy();
        return issue;
    }

    async findByJournalId(journalId) {
        return await JournalIssue.findAll({
            where: { journal_id: journalId },
            include: [{
                model: Journal,
                as: 'journal',
                attributes: ['id', 'title'],
            }],
            order: [['year', 'DESC'], ['volume', 'DESC'], ['issue_no', 'DESC']],
        });
    }
}

module.exports = new JournalIssueRepository();
