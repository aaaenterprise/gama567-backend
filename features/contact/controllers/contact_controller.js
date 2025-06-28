// controllers/contactController.js
const ContactService = require('../services/contact_service');
const { contactSchema } = require('../middlewares/contact_validation')
const {httpStatusCodes}= require('../../../common/utils')
class ContactController {
    async createContact(req, res) {
        try {
            const value = await contactSchema.validateAsync(req.body);
            // const{_id, ...other}=value;
            const contact = await ContactService.createContact(value, req.userData.userId);
            res.status(httpStatusCodes.created).json({success:true , message:"Contact Saved" , data:contact});
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: {} });
        }
    }

    async getContacts(req, res) {
        try {
            const contacts = await ContactService.getContacts(req.userData.userId);
            res.status(httpStatusCodes.ok).json({success:true,message:"List of Contacts", data:contacts});
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({success:false, message: error.message, data:{} });
            // res.status(httpStatusCodes.badRequest).json({error: error.message });
        }
    }
    async searchContacts(req, res) {
        try {
            const contacts = await ContactService.searchContacts(req.userData.userId, req.body);
            res.status(httpStatusCodes.ok).json({success:true,message:"List of Contacts", data:contacts});
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({success:false, message: error.message, data:{} });
            // res.status(httpStatusCodes.badRequest).json({error: error.message });
        }
    }

    async getContactById(req, res) {
        try {
            const contact = await ContactService.getContactById(req.params.id);
            if (!contact) {
                return res.status(httpStatusCodes.notFound).json({success:false, message: 'Contact not found', data:{} });
            }
            res.status(httpStatusCodes.ok).json({ success: true, message: "Contact details", data: contact });
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({ success: false, message: error.message, data: {} });        }
    }

    async updateContact(req, res) {
        try {
            const updatedContact = await ContactService.updateContact(
                req.params.id,
                req.body
            );
            if (!updatedContact) {
                return res.status(httpStatusCodes.notFound).json({success:false, message: 'Contact not found' , data:{}});
            }
            res.status(httpStatusCodes.ok).json({success:true, message:"Contact Updated Successfully", data:updatedContact});
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({ success: false, message: error.message, data: {} });        }
    }

    async deleteContact(req, res) {
        try {
            const deletedContact = await ContactService.deleteContact(req.params.id);
            // console.log(deletedContact);
            if (!deletedContact) {
                return res.status(httpStatusCodes.notFound).json({success:false, message: 'Contact not found', data:{} });
            }
           return res.status(httpStatusCodes.accepted).json({ success: true, message: "Contact Deleted Successfully", data: {} });
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({ success: false, message: error.message, data: {} });        }
    }


    // contact note controller

    async addContactNote(req, res) {
        try {

            const { contactId, ...other } = req.body;
            console.log(contactId, other);
            const contact = await ContactService.addContactNotes(
                contactId, other
            );

            res.status(httpStatusCodes.ok).json({success:true, message:"Contact Note Added Successfully",data:contact});
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({ success: false, message: error.message, data: {} });        }
    }
    async getContactNote(req, res) {
        try {


            const contact = await ContactService.getContactNotes(
                req.body.contactId
            );

            res.status(httpStatusCodes.ok).json({ success: true, message: "Contact Notes", data: contact });
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({ success: false, message: error.message, data: {} });        }
    }

    async updateContactNote(req, res) {
        try {
            const updatedContact = await ContactService.updateContactNotes(
                req.params.id,
                req.body
            );
            if (!updatedContact) {
                return res.status(httpStatusCodes.notFound).json({ success: true, message: "Contact Not Found", data: {}});
            }
            res.status(httpStatusCodes.ok).json({ success: true, message: "Contact Note Updated Successfully", data: updatedContact });
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({ success: false, message: error.message, data: {} });        }
    }
    async deleteContactNote(req, res) {
        try {
            const deletedContact = await ContactService.deleteContactNotes(req.params.id, req.body.noteId);
            if (!deletedContact) {
                return res.status(httpStatusCodes.notFound).json({ message: 'Contact note not found' });
            }
            res.status(httpStatusCodes.accepted).json({ message: 'Contact note deleted successfully' });
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({ success: false, message: error.message, data: {} });        }
    }


    // contact phone controller

    async addContactPhone(req, res) {
        try {

            const { contactId, ...other } = req.body;

            const contact = await ContactService.addContactPhone(
                contactId, other
            );

            res.status(httpStatusCodes.ok).json({success: true, message: "Contact Phone Added Successfully", data: contact});
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({ success: false, message: error.message, data: {} });        }
    }
    async getContactPhone(req, res) {
        try {


            const contact = await ContactService.getContactPhone(
                req.body.contactId
            );

            res.status(httpStatusCodes.ok).json({ success: true, message: "Contact Phone", data: contact });
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({ success: false, message: error.message, data: {} });        }
    }


    async updateContactPhone(req, res) {
        try {
            const updatedContact = await ContactService.updateContactPhone(
                req.params.id,
                req.body
            );
            if (!updatedContact) {
                return res.status(httpStatusCodes.notFound).json({success:false, message: 'Contact Phone not found', data:{} });
            }
            res.status(httpStatusCodes.ok).json({ success: true, message: "Contact Phone Updated Successfully", data: updatedContact });
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({ success: false, message: error.message, data: {} });        }
    }
    async deleteContactPhone(req, res) {
        try {
            const deletedContact = await ContactService.deleteContactPhone(req.params.id, req.body.noteId);
            if (!deletedContact) {
                return res.status(httpStatusCodes.notFound).json({success:false,  message: 'Contact phone not found', data:{} });
            }
            res.status(httpStatusCodes.accepted).json({success:true, message: 'Contact phone deleted successfully', data:{} });
        } catch (error) {
            res.status(httpStatusCodes.badRequest).json({ success: false, message: error.message, data: {} });        }
    }

    // contact Email controller

    async addContactEmail(req, res) {
        try {

            const { contactId, ...other } = req.body;

            const contact = await ContactService.addContactEmail(
                contactId, other
            );

            res.status(httpStatusCodes.ok).json({ success: true, message: "Contact Email Added Successfully", data: contact });
        } catch (error) {
           res.status(httpStatusCodes.badRequest).json({success:false, message: error.message, data:{} });
        }
    }
    async getContactEmail(req, res) {
        try {


            const contact = await ContactService.getContactEmail(
                req.body.contactId
            );

            res.status(httpStatusCodes.ok).json({ success: true, message: "Contact Email", data: contact });
        } catch (error) {
           res.status(httpStatusCodes.badRequest).json({success:false, message: error.message, data:{} });
        }
    }



    async updateContactEmail(req, res) {
        try {
            const updatedContact = await ContactService.updateContactEmail(
                req.params.id,
                req.body
            );
            if (!updatedContact) {
                return res.status(httpStatusCodes.notFound).json({success:false, message: 'Contact Email not found', data:{}});
            }
            res.status(httpStatusCodes.ok).json({ success: true, message: "Contact Email Updated Successfully", data: updatedContact });
        } catch (error) {
           res.status(httpStatusCodes.badRequest).json({success:false, message: error.message, data:{} });
        }
    }
    async deleteContactEmail(req, res) {
        try {
            const deletedContact = await ContactService.deleteContactEmail(req.params.id, req.body.noteId);
            if (!deletedContact) {
                return res.status(httpStatusCodes.notFound).json({success:false, message: 'Contact email not found', data:{} });
            }
            res.status(httpStatusCodes.accepted).json({success:true, message: 'Contact email deleted successfully', data:{} });
        } catch (error) {
           res.status(httpStatusCodes.badRequest).json({success:false, message: error.message, data:{} });
        }
    }
    // contact SocialMedial controller

    async addContactSocialMedia(req, res) {
        try {

            const { contactId, ...other } = req.body;

            const contact = await ContactService.addContactSocialMedia(
                contactId, other
            );

            res.status(httpStatusCodes.ok).json({ success: true, message: "Contact SocialMedia Added Successfully", data: contact });
        } catch (error) {
           res.status(httpStatusCodes.badRequest).json({success:false, message: error.message, data:{} });
        }
    }
    async getContactSocialMedia(req, res) {
        try {


            const contact = await ContactService.getContactSocialMedia(
                req.body.contactId
            );

            res.status(httpStatusCodes.ok).json({ success: true, message: "Contact Social Media", data: contact });
        } catch (error) {
           res.status(httpStatusCodes.badRequest).json({success:false, message: error.message, data:{} });
        }
    }



    async updateContactSocialMedia(req, res) {
        try {
            const updatedContact = await ContactService.updateContactSocialMedia(
                req.params.id,
                req.body
            );
            if (!updatedContact) {
                return res.status(httpStatusCodes.notFound).json({success:true, message: 'Contact Notes not found', data:{} });
            }
            res.status(httpStatusCodes.ok).json({ success: true, message: "Contact Social Media Updated Successfully", data: updatedContact });
        } catch (error) {
           res.status(httpStatusCodes.badRequest).json({success:false, message: error.message, data:{} });
        }
    }
    async deleteContactSocialMedia(req, res) {
        try {
            const deletedContact = await ContactService.deleteContactSocialMedia(req.params.id, req.body.noteId);
            if (!deletedContact) {
                return res.status(httpStatusCodes.notFound).json({success:false, message: 'Contact SocialMedial not found', data:{} });
            }
            res.status(httpStatusCodes.accepted).json({success:true, message: 'Contact SocialMedial deleted successfully', data:{} });
        } catch (error) {
           res.status(httpStatusCodes.badRequest).json({success:false, message: error.message, data:{} });
        }
    }
}

module.exports = new ContactController();
