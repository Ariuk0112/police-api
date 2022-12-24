const router = require("express").Router();
const {
  showAllNews,
  showOneNews,
  createNews,
  updateNews,
  deleteNews,
  showNewsWithSubCat,
  showNewsWithCat,
} = require("./controller");

router.get("/", showAllNews);
router.post("/", createNews);
router.get("/:id", showOneNews);
router.put("/", updateNews);
router.delete("/:id", deleteNews);

router.get("/category/:cat_id", showNewsWithCat);
router.get("/subCategory/:sub_cat_id", showNewsWithSubCat);
module.exports = router;
