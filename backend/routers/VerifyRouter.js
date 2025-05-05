
const { upload } = require("../app");
const { verifyDocument } = require("../controller/VerifyController");
const router = require("express").Router();

router.post("/verify-document", upload.single('image'), verifyDocument);

module.exports = router;