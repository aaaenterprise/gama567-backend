const express = require('express');
const router = express.Router();
const DeclareResultController = require('../controllers/declare_result_controller');


router.post('/get', DeclareResultController.getDeclaredResult);
router.post('/', DeclareResultController.createResult);
router.delete('/:id', DeclareResultController.deleteDeclaredResultById);

router.post('/declare', DeclareResultController.declareResult);


module.exports = router;
