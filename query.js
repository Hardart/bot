const conn = require('./dbConnect')
const con = conn.connection().promise()
const Markup = require('node-vk-bot-api/lib/markup')

function selectAll(table) {
	return con.query(`SELECT * FROM ${table}`).then(([users]) => {
		let usersData = []
		users.forEach((user) => {
			usersData.push(Markup.button(user.name, 'primary', user.id))
		})
		return [usersData, users]
	})
}
function addUser(table = 'coaches', ...args) {
	if (table == 'coaches') {
		selectAll('coaches').then(([, users]) => {
			con.query('INSERT INTO coaches (id, name, vk_id) VALUES (?, ?, ?)', [
				users.length + 1,
				args[0],
				args[1],
			])
		})
	} else {
		con.query(
			'INSERT INTO padavans (vk_id, full_name, ren_login, coach) VALUES (?, ?, ?, ?)',
			[args[0], args[1], args[2], args[3]]
		)
	}
}

function deleteUser(value, table = 'padavans', field = 'ren_login') {
	con.query(`DELETE FROM ${table} WHERE ${field} = ?`, [value])
}
function changeUser(id, name, vk_id, table = 'coaches') {
	con.query(`UPDATE ${table} SET name = ?, vk_id = ? WHERE id = ?`, [
		name,
		vk_id,
		id,
	])
}

module.exports = {
	selectAll: selectAll,
	delete: deleteUser,
	add: addUser,
	change: changeUser,
}