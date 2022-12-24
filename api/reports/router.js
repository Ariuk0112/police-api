const router = require("express").Router();
const { showReports, createReportType, showAllReports, createReport, filterReports, showReportsWithtype, approveReport } = require("./controller");
router.get('/type', showReports);
router.get('/type/:typeId', showReportsWithtype);
router.post('/type', createReportType);

router.get('/', showAllReports);
router.post('/', createReport);


router.post('/approve', approveReport);
router.get('/:typeId', filterReports);
module.exports = router;
