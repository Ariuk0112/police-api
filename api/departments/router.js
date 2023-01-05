const router = require("express").Router();
const { auth } = require("../auth/controller");
const { createDep, showDep, deleteDep, updateDep } = require("./controller");
router.post('/', auth, createDep);
router.get('/', showDep);
router.delete('/:dep_id', auth, deleteDep);
router.put('/', auth, updateDep);

module.exports = router;
