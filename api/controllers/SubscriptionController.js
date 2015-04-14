/**
 * SubscriptionController
 *
 * @description :: Server-side logic for managing subscriptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

import WLValidationError from 'sails/node_modules/waterline/lib/waterline/error/WLValidationError';
import norwegianNumberRegexp from '../regexp/norwegianNumber';
import {ValidationError as ReCaptchaValidationError} from '../services/ReCaptchaService';


export default {

	signup: function(req, res) {
		var formdata =  req.session.formdata
		var validationErrors =  req.session.validationErrors

		delete req.session.validationErrors
		delete req.session.formdata

		res.view('subscription/index', {formdata, validationErrors, layout: 'subscription/layout'})
	},

	subscribe: async function(req, res, next) {
		var phoneNumber = req.param('phoneNumber')
		var email = req.param('email')
		var name = req.param('name')
		var reCaptchaResponse = req.param('g-recaptcha-response')

		var phoneNumberParts = norwegianNumberRegexp.exec(phoneNumber)

		if(phoneNumberParts) {
			phoneNumber = phoneNumberParts[5]
		}

		var userData = {
			name,
			email,
			phoneNumber,
			subscribesToNews: true
		}

		try {

			let captchaResponse = await ReCaptchaService.validateResponse(reCaptchaResponse)
			let user = await User.findOrCreateOne(userData)

			sails.log.debug('SubscriptionController.subscribe: User.create', user.name, user.email, user.phoneNumber)
			req.session.flash = { messages: ['Takk for din påmelding!'] }

			return res.redirect('subscription')

		}
		catch(error) {

			if(error instanceof ReCaptchaValidationError) {
				sails.log.warn('ReCaptchaService.validateResponse threw', captchaErrorResponse)
				req.session.formdata = {email, phoneNumber, name}
				req.session.flash = {
					error: true,
					messages: ['invalid captcha']
				}
				return res.redirect('subscription')
			}

			else if(error instanceof WLValidationError) {
				sails.log.info('SubscriptionController:subscribe User.findOrCreateOne threw WLValidationError', error.message)
				req.session.formdata = {email, phoneNumber, name}
				req.session.flash = {
					error: true,
					messages: [error.message]
				}
				return res.redirect('subscription')
			}

			else {
				sails.log.error('SubscriptionController:subscribe User.findOrCreateOne threw Error', error)
				return res.serverError(error)
			}

		}
	}

}
