const journalIssueService = require('../services/JournalIssueService');

class JournalIssueController {
    async createIssue(req, res, next) {
        try {
            const issue = await journalIssueService.createIssue(req.body);
            res.status(201).json({
                success: true,
                message: 'Journal issue created successfully',
                data: issue,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllIssues(req, res, next) {
        try {
            const issues = await journalIssueService.getAllIssues();
            res.status(200).json({
                success: true,
                data: issues,
            });
        } catch (error) {
            next(error);
        }
    }

    async getIssueById(req, res, next) {
        try {
            const issue = await journalIssueService.getIssueById(req.params.id);
            res.status(200).json({
                success: true,
                data: issue,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateIssue(req, res, next) {
        try {
            const issue = await journalIssueService.updateIssue(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Journal issue updated successfully',
                data: issue,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteIssue(req, res, next) {
        try {
            await journalIssueService.deleteIssue(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Journal issue deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async getIssuesByJournal(req, res, next) {
        try {
            const issues = await journalIssueService.getIssuesByJournal(req.params.journalId);
            res.status(200).json({
                success: true,
                data: issues,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new JournalIssueController();
