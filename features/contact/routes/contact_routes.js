// routes/contacts.js
const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contact_controller');
const authMiddleWare=require('../../authentication/middleware/authMiddleware')


/*
// REST API for contact
*/

router.post('/', authMiddleWare, ContactController.createContact);
router.get('/',authMiddleWare, ContactController.getContacts);
router.get('/:id', authMiddleWare,ContactController.getContactById);
router.put('/:id', authMiddleWare,ContactController.updateContact);
router.delete('/:id', authMiddleWare,ContactController.deleteContact);
router.post('/search/', authMiddleWare,ContactController.searchContacts);



/*
// REST API for contact notes
*/

router.post('/notes/', authMiddleWare, ContactController.addContactNote);
router.get('/notes/', authMiddleWare, ContactController.getContactNote);
// router.get('/notes/:id', authMiddleWare, ContactController.getContactById);
router.put('/notes/:id', authMiddleWare, ContactController.updateContactNote);
router.delete('/notes/:id', authMiddleWare, ContactController.deleteContactNote);


/*
// REST API for contact email
*/

router.post('/email/', authMiddleWare, ContactController.addContactEmail);
router.get('/email/', authMiddleWare, ContactController.getContactEmail);
// router.get('/email/:id', authMiddleWare, ContactController.getContactById);
router.put('/email/:id', authMiddleWare, ContactController.updateContactEmail);
router.delete('/email/:id', authMiddleWare, ContactController.deleteContactEmail);


/*
// REST API for contact phone
*/

router.post('/phone/', authMiddleWare, ContactController.addContactPhone);
router.get('/phone/', authMiddleWare, ContactController.getContactPhone);
// router.get('/phone/:id', authMiddleWare, ContactController.getContactById);
router.put('/phone/:id', authMiddleWare, ContactController.updateContactPhone);
router.delete('/phone/:id', authMiddleWare, ContactController.deleteContactPhone);
/*
// REST API for contact Social Medial
*/

router.post('/social-media/', authMiddleWare, ContactController.addContactSocialMedia);
router.get('/social-media/', authMiddleWare, ContactController.getContactSocialMedia);
// router.get('/phone/:id', authMiddleWare, ContactController.getContactById);
router.put('/social-media/:id', authMiddleWare, ContactController.updateContactSocialMedia);
router.delete('/social-media/:id', authMiddleWare, ContactController.deleteContactSocialMedia);

module.exports = router;
