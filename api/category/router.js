const router = require("express").Router();
const { auth } = require("../auth/controller");
const {
  createCategory,
  showAllCategory,
  createSubCategory,
  subCategory,
  updateCategory,
  updateSubCategory,
  deleteCategory,
  deleteSubCategory,
  showSubCategoryWithCatId,
} = require("./controller");
router.post("/", auth, createCategory);
router.put("/", auth, updateCategory);
router.get("/", showAllCategory);
router.delete("/:id", auth, deleteCategory);

router.post("/subCategory", auth, createSubCategory);
router.put("/subCategory", auth, updateSubCategory);
router.get("/subCategory/:id", subCategory);
router.delete("/subCategory/:id", auth, deleteSubCategory);


router.get("/:id", showSubCategoryWithCatId);
module.exports = router;
