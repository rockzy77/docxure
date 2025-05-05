const multer = require('multer');
const path = require('path');
const ACTION = require("../models/ActionLogModel");
const LEDGERPROCESS = require("../models/LedgerProcessModel");
const LEDGER = require('../models/LedgerModel');

exports.getProcessByStatus = async (req, res) => {
    const { status } = req.params;

    try {
        const process = await LEDGERPROCESS.findAll({
            where: {
                LPSTATUS: status
            }
        });

        if (!process) {
            return res.status(404).json({ success: false, message: "Process not found" });
        }

        res.status(200).json({ process, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching process", details: error });
    }
}

exports.updateProcess = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const process = await LEDGERPROCESS.findByPk(id);

        if (!process) {
            return res.status(404).json({ success: false, message: "Process not found" });
        }

        await process.update(updates);

        if (updates.STATUS == 'approved') {
            try {
                console.log(process.LID);
                const ledger = await LEDGER.findByPk(parseInt(process.LID));
                console.log(ledger);
                await ledger.update({
                    IS_ACTIVE: true
                });
            }
            catch (ledgerError) {
                console.log("Error updating ledger: ", ledgerError);
            }
            try {
                await ACTION.create({
                    TYPE: 'process',
                    ACTION: 'approved',
                    ACTION_BY: 3
                });
            } catch (actionError) {
                console.log("Error creating action log: ", actionError);
            }
        }
        else if (updates.STATUS == 'rejected') {
            try {
                await ACTION.create({
                    TYPE: 'process',
                    ACTION: 'rejected',
                    ACTION_BY: 3
                });
            } catch (actionError) {
                console.log("Error creating action log: ", actionError);
            }
        }



        res.status(200).json({ success: true, message: "Process updated successfully", process });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating process", details: error });
    }
};

exports.deleteProcess = async (req, res) => {
    const { id } = req.params;

    try {
        const process = await LEDGERPROCESS.findByPk(id);

        if (!process) {
            return res.status(404).json({ success: false, message: "Process not found" });
        }

        await process.destroy();

        try {
            await ACTION.create({
                TYPE: 'process',
                ACTION: 'deleted',
                ACTION_BY: 3
            });
        } catch (actionError) {
            console.log("Error creating action log: ", actionError);
        }


        res.status(200).json({ success: true, message: "Process deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting process", details: error });
    }
};

exports.createProcess = async (req, res) => {
    const { LID, STATUS } = req.body;

    var fileUrl = null;

    if (req.file) {
        fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    try {

        const processExist = await LEDGERPROCESS.findOne({
            where: {
                LID
            }
        });

        if (processExist) {
            await processExist.update({
                DOCURL: fileUrl,
                STATUS
            });
        }

        else {
            await LEDGERPROCESS.create({
                LID,
                DOCURL: fileUrl,
                STATUS
            });
        }

        try {
            await ACTION.create({
                TYPE: 'process',
                ACTION: 'created',
                ACTION_BY: LID
            });
        } catch (actionError) {
            console.log("Error creating action log: ", actionError);
        }

        res.status(201).json({ success: true, message: "Process created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating process", details: error });
    }
};


exports.getProcessByLMID = async (req, res) => {
    const { LID } = req.params;

    try {
        const process = await LEDGERPROCESS.findAll({
            where: {
                LID
            }
        });

        if (!process) {
            return res.status(404).json({ success: false, message: "Process not found" });
        }

        res.status(200).json({ process, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching process", details: error });
    }
};

exports.getAllProcesses = async (req, res) => {
    try {
        const processes = await LEDGERPROCESS.findAll();

        if (!processes) {
            return res.status(404).json({ success: false, message: "Processes not found" });
        }

        res.status(200).json({ processes, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching processes", details: error });

    }
};

