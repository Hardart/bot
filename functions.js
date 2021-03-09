const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const api = require('node-vk-bot-api/lib/api');


module.exports = {
	photo: async function (filename, userID, token, bot, mess = "") {
		const url = await api('photos.getMessagesUploadServer', {
			peer_id: userID,
			access_token: token
		}).then(url => url.response.upload_url)

		let img = fs.readFileSync("./img/" + filename)
		const form = new FormData()
		form.append('photo', img, {
			contentType: 'img/png',
			name: 'photo',
			filename: filename,
		})
		const object = await fetch(url, {
			method: 'POST',
			body: form
		}).then(obj => obj.json())
		await api('photos.saveMessagesPhoto', {
			photo: object.photo,
			server: object.server,
			hash: object.hash,
			access_token: token
		}).then(data => {
			const response = data.response[0]
			const attach = 'photo' + response.owner_id + '_' + response.id
			bot.sendMessage(userID, mess, attach)
		})
	},
	test: () => {
		console.log("hello");
	}
}
