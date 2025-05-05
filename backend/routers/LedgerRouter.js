const { getAllUsers, signup, login, getUserByToken, updateUser, deleteUser } = require("../controller/LedgerController");

const router = require("express").Router();


router.post("/registerLedger", signup);

router.post("/loginLedger", login);

router.get("/getUserByToken", getUserByToken);

router.put("/updateUser/:id", updateUser);

router.get("/getAllUsers", getAllUsers);

router.delete("/deleteUser/:id", deleteUser);

module.exports = router;