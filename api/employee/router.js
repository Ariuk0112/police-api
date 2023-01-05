const router = require("express").Router();
const { auth } = require("../auth/controller");
const { createEmp, showAllEmp, showOneEmp, updateEmp, deleteOneEmp } = require("./controller");
router.post('/', auth, createEmp);
router.get('/', showAllEmp);
router.get('/:id', auth, showOneEmp);
router.put('/', auth, updateEmp);
router.delete('/', auth, deleteOneEmp);

module.exports = router;
