export const greetings = (name: string) =>
  `Приветствую, ${name ?? 'Аноним'} 👋`;

export const baseCallToAction = 'Что будем делать дальше? 🤔';

export const requestLink = 'Пришли мне ссылку, пожалуйста.';

export const requestLinkName = 'Пришли мне короткое описание.';

export const linkNameTooLong =
  'Увы, на короткое описание это не похоже. 😔\n\nПопробуем еще раз?';

export const addedLinkInvalid =
  'Кажется, с этой ссылкой что-то не так. Давай попробуем ещё?';

export const addedLinkValid = (code: string) =>
  `Отлично, записал!\n\nДержи код ссылки:\n\n${code}`;

export const requestLinkCode = 'Введи код ссылки, пожалуйста.';

export const invalidCode =
  'Не похоже на код для получения ссылки. Попробуем еще?';

export const linkCodeNotFound =
  'К сожалению, ссылки по такому коду не существует. Попробуем ещё?';

export const returnLink = (external: boolean, link: string, code: string) =>
  `<b>${
    external ? 'Кажется, кто-то поделился с тобой кодом' : 'Ссылка по коду'
  } ${code}</b>:\n\n${link}`;

export const requestToDelete =
  'Пришли мне, пожалуйста, код для удаления ссылки.';

export const deletableNotFound =
  'Не нашел у тебя такой ссылки. Попробуем ещё раз?';

export const successfullyDeleted = 'Успешно удалено';
