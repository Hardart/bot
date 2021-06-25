require('dotenv/config')
const mysql = require('mysql2')
const kbd = require('./keyboards')
const scenes = require('./scenes')
const { Padavan, RegData } = require('./models/padavans')
const express = require('express')
const mongoose = require('mongoose')
const VkBot = require('node-vk-bot-api')
const api = require('node-vk-bot-api/lib/api')
const Session = require('node-vk-bot-api/lib/session')
const Stage = require('node-vk-bot-api/lib/stage')
const Markup = require('node-vk-bot-api/lib/markup')
const usersRoute = require('./routes/users')
const pugRoute = require('./routes/pug')
const TOKEN = process.env.VK_TOKEN
const app = express()
const PORT = process.env.PORT || 80
const bot = new VkBot({
   token: TOKEN,
   confirmation: process.env.VK_CONFIRM,
})
const connection = mysql.createConnection({
   host: 'mysql.hosting.nic.ru',
   user: 'h911249946_hard',
   password: 'qaZ134679',
   database: 'h911249946_test',
})
// photo('Castle.png', process.env.VK_ID, TOKEN, bot) // отправка фото

app.set('views', './views')
app.set('view engine', 'pug')
app.use('/post', usersRoute)
app.use('/pug', pugRoute)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// --------- блок сценариев -------------
const addScene = scenes.addCoach
const changeScene = scenes.changeCoach
const deleteScene = scenes.deleteCoach
const session = new Session()
const stage = new Stage(addScene, changeScene, deleteScene)

bot.use(session.middleware())
bot.use(stage.middleware())
// ----------------------------

let users = [
   Markup.button('1', 'primary'),
   Markup.button('2', 'primary'),
   Markup.button('3', 'primary'),
   Markup.button('4', 'primary'),
   Markup.button('5', 'primary'),
   Markup.button('6', 'primary'),
   Markup.button('7', 'primary'),
   Markup.button('8', 'primary'),
   Markup.button('9', 'primary'),
   Markup.button('10', 'primary'),
   Markup.button('11', 'primary'),
   Markup.button('12', 'primary'),
   Markup.button('13', 'primary'),
   Markup.button('14', 'primary'),
   Markup.button('15', 'primary'),
   Markup.button('16', 'primary'),
   Markup.button('17', 'primary'),
   Markup.button('18', 'primary'),
]
// connection.query(
//    'INSERT INTO `coaches` (name, vk_id) VALUES (?, ?)',
//    ['John', 745641],
//    function (err, results) {
//       // results.forEach((user) => {
//       //    console.log(user.name)
//       // })
//       console.log(results)
//    }
// )
// connection.query(
//    'DELETE FROM `coaches` WHERE `id` = 23',
//    function (err, results) {
//       console.log(results)
//    }
// )

bot.command('/config', (ctx) => {
   let users = ''
   connection.query('SELECT * FROM `coaches`', function (err, results) {
      results.forEach((user) => {
         // console.log(user.name)
         users += `${user.name}\n`
      })

      ctx.reply(
         `Отлично!\nВот основные настройки\n${users}`,
         null,
         kbd.mainMenu
      )
   })
})

bot.on(async (ctx) => {
   const payload = ctx.message.payload
   const userMsg = ctx.message.text
   const userID = ctx.message.from_id
   const user = await api('users.get', {
      user_ids: userID,
      access_token: TOKEN,
   }).then((data) => data.response[0])

   if (payload) {
      const btn = JSON.parse(payload)
      switch (btn.value) {
         case 'delete_coach':
            ctx.scene.enter('deleteCoach')
            break
         case 'change_coach':
            ctx.scene.enter('changeCoach')
            break
         case 'add_coach':
            ctx.scene.enter('addCoach')
            break
         case 'coach_config':
            ctx.reply('Выбери действие', null, kbd.coachMenu)
            break
         case 'stepBack':
            ctx.scene.enter('changeCoach', [1])
            break
         default:
            ctx.reply(`You clicked button - ${btn}`)
      }
   } else {
      ctx.reply('Без знаний ты не сможешь настроить мои программы')
   }
})

app.post('/', bot.webhookCallback)

async function start() {
   try {
      // await mongoose.connect(process.env.DB_CONN, {
      //    useFindAndModify: false,
      //    useNewUrlParser: true,
      //    useUnifiedTopology: true,
      // })
      await connection.connect((err) => {
         if (err) {
            console.log(err)
         } else {
            console.log('БД подключена\n------------------')
         }
      })

      app.listen(PORT, () => {
         console.log('Сервер запустился')
      })
   } catch (e) {
      console.log(e)
   }
}

start()
