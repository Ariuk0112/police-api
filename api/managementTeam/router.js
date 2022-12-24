const router = require("express").Router();
const { deleteMember, createTeam, showAllMember } = require("./controller");

router.post("/", createTeam);
router.get("/", showAllMember);
router.delete("/:id", deleteMember);
module.exports = router;
