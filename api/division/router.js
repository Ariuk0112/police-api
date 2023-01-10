const router = require("express").Router();
const { auth } = require("../auth/controller");
const { create_division, create_division_tab, getDivList, getDivTabById, update_division, update_division_tab, deleteDiv, deleteDivTab } = require("./controller");
router.post("/", auth, create_division);
router.post("/tab", auth, create_division_tab);

router.get("/", getDivList);
router.get("/:id", getDivTabById);

router.put("/", auth, update_division);
router.put("/tab", auth, update_division_tab);

router.delete("/:id", auth, deleteDiv);
router.delete("/tab/:id", auth, deleteDivTab);
module.exports = router;
