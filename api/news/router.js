const { auth } = require("../auth/controller");
const router = require("express").Router();
const {
  showAllNews,
  showOneNews,
  createNews,
  updateNews,
  deleteNews,
  showNewsWithSubCat,
  showNewsWithCat,
  searchNews,
} = require("./controller");

router.get("/search", searchNews);
router.get("/", showAllNews);
router.post("/", auth, createNews);
router.get("/:id", showOneNews);
router.put("/", auth, updateNews);
router.delete("/:id", auth, deleteNews);

router.get("/category/:cat_id", showNewsWithCat);
router.get("/subCategory/:sub_cat_id", showNewsWithSubCat);
module.exports = router;
