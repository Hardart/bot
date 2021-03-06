const Markup = require('node-vk-bot-api/lib/markup')

const mainMenu = Markup.keyboard([
  [
    Markup.button('Настройка учеников', 'secondary', {
      value: 'padavan_config',
    }),
  ],
  [
    Markup.button('Настройки тренеров', 'secondary', {
      value: 'coach_config',
    }),
  ],
]).oneTime()

const coachMenu = Markup.keyboard([
  [Markup.button('Добавить тренера', 'positive', { value: 'add_coach' })],
  [Markup.button('Изменить тренера', 'primary', { value: 'change_coach' })],
  [Markup.button('Удалить тренера', 'secondary', { value: 'delete_coach' })],
  [Markup.button('Назад', 'negative', { value: 'main_menu' })],
]).oneTime()

const padavanMenu = Markup.keyboard([
  [Markup.button('Сбросить данные', 'positive', { value: 'clear_data' })],
  [Markup.button('Назначить тренера', 'primary', { value: 'send_to_coach' })],
  [
    Markup.button('Добавить ученика (временно)', 'primary', {
      value: 'add_padavan',
    }),
  ],
  [Markup.button('Удалить ученика', 'secondary', { value: 'delete_padavan' })],
  [Markup.button('Назад', 'negative', { value: 'main_menu' })],
]).oneTime()

const confirmBtns = Markup.keyboard([
  [Markup.button('Назад', 'negative', { value: 'stepBack' })],
  [
    Markup.button('Да', 'positive', { value: 'yes' }),
    Markup.button('Отмена', 'secondary', { value: 'no' }),
  ],
]).oneTime()

module.exports = {
  mainMenu: mainMenu,
  coachMenu: coachMenu,
  padavanMenu: padavanMenu,
  confirmBtns: confirmBtns,
  backAction: Markup.keyboard([
    Markup.button('Отменить', 'negative', { value: 'cancel' }),
  ]).oneTime(),
}
