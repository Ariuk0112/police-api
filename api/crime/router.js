const router = require("express").Router();
const { auth } = require("../auth/controller");
const { readFile, getCrimeList, getCrimeList_type, getCrimeList_subtype, createSubtype, showSubtype, getCount, deleteSub, updateCrimeType, deleteLastImport } = require("./controller");
router.post("/upload", auth, readFile);

router.get("/", getCrimeList);
router.get("/count", getCount);

router.post("/type", auth, createSubtype);
router.delete("/type/:c_type_id", auth, deleteSub);
router.get("/type", showSubtype);
router.put("/type", auth, updateCrimeType);

router.post("/filter/sub", getCrimeList_subtype);
router.post("/filter/type", getCrimeList_type);
router.delete("/deleteLast", auth, deleteLastImport);
module.exports = router;
