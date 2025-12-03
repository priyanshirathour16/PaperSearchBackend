const journalRepository = require('../repositories/JournalRepository');

class JournalService {
    async createJournal(data) {
        const { editorial_board, ...journalData } = data;
        return await journalRepository.create(journalData, editorial_board);
    }

    async getAllJournals() {
        return await journalRepository.findAll();
    }

    async getJournalById(id) {
        const journal = await journalRepository.findById(id);
        if (!journal) {
            throw new Error('Journal not found');
        }
        return journal;
    }

    async updateJournal(id, data) {
        const { editorial_board, ...journalData } = data;
        return await journalRepository.update(id, journalData, editorial_board);
    }

    async deleteJournal(id) {
        const deleted = await journalRepository.delete(id);
        if (!deleted) {
            throw new Error('Journal not found');
        }
        return { message: 'Journal deleted successfully' };
    }

    async addEditor(id, editor) {
        return await journalRepository.addEditor(id, editor);
    }

    async deleteEditor(editorId) {
        return await journalRepository.deleteEditor(editorId);
    }
}

module.exports = new JournalService();
