const router = require("express").Router();
const { auth } = require("../auth/controller");
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
router.post("/", auth, createCategory);
router.put("/", auth, updateCategory);
router.get("/", showAllCategory);
router.get("/:id", showSubCategoryWithCatId);
router.delete("/:id", auth, deleteCategory);

router.post("/subCategory", auth, createSubCategory);
router.put("/subCategory", auth, updateSubCategory);
router.get("/subCategory", showSubCategory);
router.delete("/subCategory/:id", auth, deleteSubCategory);

module.exports = router;
