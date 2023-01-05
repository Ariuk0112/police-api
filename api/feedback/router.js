const router = require("express").Router();
const { auth } = require("../auth/controller");

const {
  showAllOptions,
  createFeedback,
  submitFeedback,
  deleteFeedback,
  updateOption,
} = require("./controller");
router.get("/", showAllOptions);
router.post("/", auth, createFeedback);
router.post("/submit", submitFeedback);
router.put("/", auth, updateOption);
router.delete("/:id", auth, deleteFeedback);
module.exports = router;
