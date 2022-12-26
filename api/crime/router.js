const router = require("express").Router();
const { readFile, getCrimeList, getCrimeList_type, getCrimeList_subtype, createSubtype, showSubtype, getCount, deleteSub } = require("./controller");
router.post("/upload", readFile);

router.get("/", getCrimeList);
router.get("/count", getCount);

router.post("/type", createSubtype);
router.delete("/type/:c_type_id", deleteSub);
router.get("/type", showSubtype);

router.get("/filter/sub", getCrimeList_subtype);
router.get("/filter/type", getCrimeList_type);
module.exports = router;
