const router = require("express").Router();
const { createDep, showDep } = require("./controller");
router.post('/', createDep);
router.get('/', showDep);

module.exports = router;
