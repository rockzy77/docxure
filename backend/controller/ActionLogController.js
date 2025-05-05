const ACTIONLOG = require('../models/ActionLogModel');

exports.getAllActionLogs = async (req, res) => {
    try {
        const actionLogs = await ACTIONLOG.findAll();

        if (!actionLogs) {
            return res.status(404).json({ success: false, message: "Action Logs not found" });
        }

        res.status(200).json({ actionLogs, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching action logs", details: error });
    }
};

exports.getActionLogByLID = async (req, res) => {
    const { id } = req.params;

    try {
        const actionLog = await ACTIONLOG.findByPk(id);

        if (!actionLog) {
            return res.status(404).json({ success: false, message: "Action Log not found" });
        }

        res.status(200).json({ actionLog, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching action log", details: error });
    }
};

exports.createActionLog = async (req, res) => {
    const { TYPE, ACTION, ACTION_BY } = req.body;

    try {
        const actionLog = await ACTIONLOG.create({
            TYPE,
            ACTION,
            ACTION_BY
        });

        res.status(201).json({ actionLog, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating action log", details: error });
    }
};

