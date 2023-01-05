const { auth } = require("../auth/controller");
const router = require("express").Router();
const { showReports, createReportType, showAllReports, createReport, filterReports, showReportsWithtype, approveReport, deleteReportType, createCrimeType, deleteCrimeType, showcrimetype } = require("./controller");


router.get('/type', showReports);
router.get('/type/:typeId', auth, showReportsWithtype);
router.post('/type', auth, createReportType);
router.delete('/type/:typeId', auth, deleteReportType);

router.get('/', auth, showAllReports);
router.post('/', createReport);


router.post("/crimeType", auth, createCrimeType);
router.delete("/crimeType/:c_type_id", auth, deleteCrimeType);
router.get("/crimeType", showcrimetype);

router.post('/approve', auth, approveReport);
router.get('/:typeId', auth, filterReports);
module.exports = router;
