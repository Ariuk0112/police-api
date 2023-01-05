const router = require("express").Router();
const { deleteMember, createTeam, showAllMember, updateManTeam } = require("./controller");

router.post("/", createTeam);
router.get("/", showAllMember);
router.delete("/:id", deleteMember);
router.put("/", updateManTeam);
module.exports = router;
