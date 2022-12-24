const router = require("express").Router();
const {
  createCategory,
  showAllCategory,
  createSubCategory,
  showSubCategory,
  updateCategory,
  updateSubCategory,
  deleteCategory,
  deleteSubCategory,
  showSubCategoryWithCatId,
} = require("./controller");
router.post("/", createCategory);
router.put("/", updateCategory);
router.get("/", showAllCategory);
router.get("/:id", showSubCategoryWithCatId);
router.delete("/:id", deleteCategory);

router.post("/subCategory", createSubCategory);
router.put("/subCategory", updateSubCategory);
router.get("/subCategory", showSubCategory);
router.delete("/subCategory/:id", deleteSubCategory);

module.exports = router;
