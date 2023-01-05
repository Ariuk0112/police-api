const router = require("express").Router();
const { auth } = require("../auth/controller");
const { deleteMember, createTeam, showAllMember, updateManTeam } = require("./controller");

router.post("/", auth, createTeam);
router.get("/", showAllMember);
router.delete("/:id", auth, deleteMember);
router.put("/", auth, updateManTeam);
module.exports = router;
