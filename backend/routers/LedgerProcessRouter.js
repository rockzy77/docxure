const { upload } = require("../app");
const { getProcessByStatus, getAllProcesses, updateProcess, deleteProcess, createProcess, getProcessByLMID } = require("../controller/LedgerProcessController");

const router = require("express").Router();


router.get("/getProcessByStatus", getProcessByStatus);
router.put("/updateProcess/:id", updateProcess);
router.delete("/deleteProcess/:id", deleteProcess);
router.get("/getAllProcess", getAllProcesses);
router.get("/getProcessByLID/:LID", getProcessByLMID);
// createProcess router with file upload
router.post("/createProcess", upload.single('image'), createProcess);

module.exports = router;