const router = require('express').Router()
const consigneController = require("../database/controllers/consigne.controller")

router.post('/', consigneController.createConsigne)
router.get('/', consigneController.getAllConsignes)
router.get('/:id', consigneController.getConsigneById)
router.patch('/:id', consigneController.updateConsigne)
router.delete('/:consigneId', consigneController.deleteConsigneById)

module.exports = router