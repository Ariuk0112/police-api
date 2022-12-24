const router = require("express").Router();
const {
  showAllOptions,
  createFeedback,
  submitFeedback,
  deleteFeedback,
  updateOption,
} = require("./controller");
router.get("/", showAllOptions);
router.post("/", createFeedback);
router.post("/submit", submitFeedback);
router.put("/", updateOption);
router.delete("/:id", deleteFeedback);
module.exports = router;
