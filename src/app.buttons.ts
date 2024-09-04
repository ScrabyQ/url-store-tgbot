import { Markup } from 'telegraf';

export const buttons = {
  ALL_LINKS: '📝 Все ссылки',
  ADD_LINK: '✍️ Добавить ссылку',
  GET_LINK: '📥 Получить ссылку',
  DELETE_LINK: '❌ Удалить ссылку',
};

export const backBtn = 'Назад';

export function mainKeyboard() {
  return Markup.keyboard([...Object.values(buttons)], {
    columns: 2,
  }).resize();
}

export function pageButtons(opts: { left: boolean; right: boolean }) {
  const { left, right } = opts;
  const keys = [];
  if (left) keys.push(Markup.button.callback('<', 'left'));
  if (right) keys.push(Markup.button.callback('>', 'right'));

  return Markup.inlineKeyboard(keys);
}
