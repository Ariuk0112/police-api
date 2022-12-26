const router = require("express").Router();
const { createEmp, showAllEmp, showOneEmp, updateEmp, deleteOneEmp } = require("./controller");
router.post('/', createEmp);
router.get('/', showAllEmp);
router.get('/:id', showOneEmp);
router.put('/', updateEmp);
router.delete('/', deleteOneEmp);

module.exports = router;
