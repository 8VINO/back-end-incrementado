const express = require('express');
const ContaController = require ('../controllers/contaController.js');
const router = express.Router();


router.put('/conta/meta/:id_conta', ContaController.Update);
router.get('/conta/buscar/:id_usuario', ContaController.SearchOne);
router.get('/conta/meta/:id_conta', ContaController.SearchMeta)



module.exports = router;