const router = require("express").Router();
const { createDep, showDep, deleteDep, updateDep } = require("./controller");
router.post('/', createDep);
router.get('/', showDep);
router.delete('/:dep_id', deleteDep);
router.put('/', updateDep);

module.exports = router;
