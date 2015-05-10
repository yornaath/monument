/**
 * IndexController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

import Promise from 'bluebird';

export default {

	layout: 'layout',

	index: async function(req, res) {

		var [pages, podcasts] = await Promise.all([ Page.find(), Podcast.find() ])
		var currentPage = {name: 'podcasts'}

		return res.view('index', {currentPage, pages, podcasts})
	}

};