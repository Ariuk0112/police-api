const router = require("express").Router();
const { auth } = require("../auth/controller");
const { showFAQ, create_faq, create_key, show_key, deleteFAQ, deleteKey, update_key, updateFAQ } = require("./controller");
router.post("/question", showFAQ);
router.post("/", auth, create_faq);
router.put("/", auth, updateFAQ);
router.delete("/:id", auth, deleteFAQ);

router.post("/key", auth, create_key);
router.put("/key", auth, update_key);
router.get("/key", show_key);
router.delete("/key/:id", auth, deleteKey);
module.exports = router;
