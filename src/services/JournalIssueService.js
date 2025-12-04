const journalIssueRepository = require('../repositories/JournalIssueRepository');
const JournalRepository = require('../repositories/JournalRepository');

class JournalIssueService {
    async createIssue(issueData) {
        // Verify journal exists
        const journal = await JournalRepository.findById(issueData.journal_id);
        if (!journal) {
            throw new Error('Journal not found');
        }

        return await journalIssueRepository.create(issueData);
    }

    async getAllIssues() {
        return await journalIssueRepository.findAll();
    }

    async getIssueById(id) {
        const issue = await journalIssueRepository.findById(id);
        if (!issue) {
            throw new Error('Journal issue not found');
        }
        return issue;
    }

    async updateIssue(id, issueData) {
        // If journal_id is being updated, verify the new journal exists
        if (issueData.journal_id) {
            const journal = await JournalRepository.findById(issueData.journal_id);
            if (!journal) {
                throw new Error('Journal not found');
            }
        }

        const updatedIssue = await journalIssueRepository.update(id, issueData);
        if (!updatedIssue) {
            throw new Error('Journal issue not found');
        }
        return updatedIssue;
    }

    async deleteIssue(id) {
        const deletedIssue = await journalIssueRepository.delete(id);
        if (!deletedIssue) {
            throw new Error('Journal issue not found');
        }
        return deletedIssue;
    }

    async getIssuesByJournal(journalId) {
        // Verify journal exists
        const journal = await JournalRepository.findById(journalId);
        if (!journal) {
            throw new Error('Journal not found');
        }

        return await journalIssueRepository.findByJournalId(journalId);
    }
}

module.exports = new JournalIssueService();
