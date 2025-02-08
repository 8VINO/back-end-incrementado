const express = require('express');
const RegistroController = require ('../controllers/registroController.js');
const router = express.Router();


router.post('/registro/:id_conta', RegistroController.Insert);
router.get('/registro/:id_conta', RegistroController.SearchAll);
router.put('/registro/:id_registro', RegistroController.Update)
router.delete('/registro/:id_registro', RegistroController.Delete)

module.exports = router;