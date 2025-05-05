const { upload } = require("../app");
const { getAllActionLogs, createActionLog, getActionLogByLID } = require("../controller/ActionLogController");
const router = require("express").Router();

router.get("/getAllActionLogs", getAllActionLogs);
router.get("/getActionLogByLID/:id", getActionLogByLID);
router.post("/createActionLog", createActionLog);

module.exports = router;