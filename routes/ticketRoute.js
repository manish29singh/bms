const router = require('express').Router()
var ticketController = require('../controllers/ticketController')
var middleware = require('../middlewares/index')

//create
router.get('/', middleware.ensureAuthenticated, ticketController.addTicket)
router.post('/', middleware.ensureAuthenticated, ticketController.addTicket)

//edit
router.get('/:ticketId',middleware.ensureAuthenticated, ticketController.showEditTicket)
router.post('/edit-ticket',middleware.ensureAuthenticated, ticketController.editTicket)

//delete
router.get('/:ticketId', middleware.ensureAuthenticated, ticketController.deleteTicket)

router.post('/ticket-status', ticketController.changeTicketStatus);

module.exports = router;