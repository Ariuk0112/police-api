const router = require("express").Router();
const { showFAQ, create_faq, create_key, show_key, deleteFAQ, deleteKey, update_key, updateFAQ } = require("./controller");
router.post("/question", showFAQ);
router.post("/", create_faq);
router.put("/", updateFAQ);
router.delete("/:id", deleteFAQ);

router.post("/key", create_key);
router.put("/key", update_key);
router.get("/key", show_key);
router.delete("/key/:id", deleteKey);
module.exports = router;
