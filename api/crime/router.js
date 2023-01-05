const router = require("express").Router();
const { auth } = require("../auth/controller");
const { readFile, getCrimeList, getCrimeList_type, getCrimeList_subtype, createSubtype, showSubtype, getCount, deleteSub, updateCrimeType } = require("./controller");
router.post("/upload", auth, readFile);

router.get("/", getCrimeList);
router.get("/count", getCount);

router.post("/type", auth, createSubtype);
router.delete("/type/:c_type_id", auth, deleteSub);
router.get("/type", showSubtype);
router.put("/type", auth, updateCrimeType);

router.get("/filter/sub", getCrimeList_subtype);
router.get("/filter/type", getCrimeList_type);
module.exports = router;
