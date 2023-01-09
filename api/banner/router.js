const router = require("express").Router();
const { auth } = require("../auth/controller");
const { createBanner, getList, updateBanner, deleteBanner } = require("./controller");

router.post("/", createBanner);
router.get("/", getList);
router.put("/", updateBanner);
router.delete("/:id", deleteBanner);

module.exports = router;
