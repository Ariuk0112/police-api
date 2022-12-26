const router = require("express").Router();
const { showReports, createReportType, showAllReports, createReport, filterReports, showReportsWithtype, approveReport, deleteReportType, createCrimeType, deleteCrimeType, showcrimetype } = require("./controller");
router.get('/type', showReports);
router.get('/type/:typeId', showReportsWithtype);
router.post('/type', createReportType);
router.delete('/type/:typeId', deleteReportType);

router.get('/', showAllReports);
router.post('/', createReport);


router.post("/crimeType", createCrimeType);
router.delete("/crimeType/:c_type_id", deleteCrimeType);
router.get("/crimeType", showcrimetype);

router.post('/approve', approveReport);
router.get('/:typeId', filterReports);
module.exports = router;
