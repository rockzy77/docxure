const { getDocumentByID, createDocument, getDocumentsByLID, revokeDocument, restoreDocument, getDocumentsByREM, getAllDocuments } = require("../controller/DocumentController");
const { upload } = require("../app");
const router = require("express").Router();

router.get("/getDocumentByID/:id", getDocumentByID);
router.get("/getAllDocuments", getAllDocuments);
router.get("/getDocumentsByLID/:lid", getDocumentsByLID);
router.get("/getDocumentsByREM/:email", getDocumentsByREM);
router.post("/createDocument", upload.single('image'), createDocument);
router.put("/revokeDocument/:id", revokeDocument);
router.put("/restoreDocument/:id", restoreDocument);

module.exports = router;