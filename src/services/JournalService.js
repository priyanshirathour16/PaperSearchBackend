const journalRepository = require('../repositories/JournalRepository');
const journalCategoryRepository = require('../repositories/JournalCategoryRepository');

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

    async getJournalByCategoryRoute(route) {
        console.log("route", route);
        const category = await journalCategoryRepository.findByRoute(route);
        if (!category) {
            throw new Error('Category not found');
        }

        const journal = await journalRepository.findLatestByCategoryId(category.id);
        if (!journal) {
            throw new Error('Journal not found in this category');
        }

        const editorialBoard = {
            chiefEditor: null,
            members: []
        };

        if (journal.editorial_board) {
            journal.editorial_board.forEach(editor => {
                const mappedEditor = {
                    title: "Dr.",
                    name: editor.name,
                    affiliation: editor.department || "",
                    profileLink: editor.profile_link || "#"
                };

                if (editor.position === 'Editor in Chief' && !editorialBoard.chiefEditor) {
                    editorialBoard.chiefEditor = mappedEditor;
                } else {
                    editorialBoard.members.push(mappedEditor);
                }
            });
        }

        const volumes = new Set(journal.issues ? journal.issues.map(i => i.volume) : []).size;
        const issuesCount = journal.issues ? journal.issues.length : 0;

        return {
            title: journal.title,
            coverImage: journal.image || null,
            stats: {
                volumes: volumes || 12,
                issues: issuesCount || 53,
                articles: (issuesCount * 5) || 294,
                yearRange: `${journal.start_year || 2011} to ${journal.end_year || 'Present'}`
            },
            issn: {
                print: journal.print_issn || null,
                online: journal.e_issn || null
            },
            impactFactors: (journal.impact_factors && journal.impact_factors.length > 0)
                ? journal.impact_factors.map(ifData => ({
                    year: ifData.year,
                    score: ifData.impact_factor
                })).sort((a, b) => b.year - a.year) // Sort by year descending
                : [
                ],
            about: [
                journal.mission || "Mission statement...",
                journal.aims_scope || "Aims and scope..."
            ],
            keyAudiences: [
                "Retail managers",
                "Suppliers and contractors",
                "Consultants",
                "Researchers and students",
                "Libraries"
            ],
            areasCovered: journal.areas_covered || ["Marketing", "Management"],
            editorialBoard: editorialBoard
        };
    }
}

module.exports = new JournalService();
