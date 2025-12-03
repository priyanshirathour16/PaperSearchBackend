const { Journal, EditorialBoard, sequelize } = require('../models');

class JournalRepository {
    async create(journalData, editorialBoardData) {
        const transaction = await sequelize.transaction();
        try {
            const journal = await Journal.create(journalData, { transaction });

            if (editorialBoardData && editorialBoardData.length > 0) {
                const editorialBoardWithJournalId = editorialBoardData.map(editor => ({
                    name: editor.name,
                    position: editor.position,
                    department: editor.department,
                    profile_link: editor.profile_link || editor.profileLink,
                    journal_id: journal.id,
                }));
                await EditorialBoard.bulkCreate(editorialBoardWithJournalId, { transaction });
            }

            await transaction.commit();
            return await this.findById(journal.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async findAll() {
        return await Journal.findAll({
            include: [{
                model: EditorialBoard,
                as: 'editorial_board',
                where: { status: 1 },
                required: false // Allow journals without editors
            }],
            order: [['createdAt', 'DESC']],
        });
    }

    async findById(id) {
        return await Journal.findByPk(id, {
            include: [{
                model: EditorialBoard,
                as: 'editorial_board',
                where: { status: 1 },
                required: false
            }],
        });
    }

    async update(id, journalData) {
        const transaction = await sequelize.transaction();
        try {
            const journal = await Journal.findByPk(id);
            if (!journal) {
                throw new Error('Journal not found');
            }

            await journal.update(journalData, { transaction });

            await transaction.commit();
            return await this.findById(id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async delete(id) {
        return await Journal.destroy({ where: { id } });
    }

    async addEditor(journalId, editorData) {
        return await EditorialBoard.create({
            name: editorData.name,
            position: editorData.position,
            department: editorData.department,
            profile_link: editorData.profile_link || editorData.profileLink,
            journal_id: journalId,
            status: 1
        });
    }

    async deleteEditor(editorId) {
        return await EditorialBoard.update({ status: 0 }, {
            where: { id: editorId }
        });
    }
}

module.exports = new JournalRepository();
