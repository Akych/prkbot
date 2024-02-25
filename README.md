### Возможности

- Скачивание EXCEL файла расписания из обсуждений ВКонтакте
- Редактирование и парсинг EXCEL фалйов.
- Предоставление интерактивного меню в телеграм по EXCEL таблице
- И прочие штуковины

Разработан для ГБПОУ "Пермский радиотехнический колледж им. А.С. Попова" в рамках дипломного проекта студента.

### Установка
Для работы необходим node.js > 16v, python3

Эмулятор браузера `sudo apt-get install chromium-browser`
Парочка библиотек `sudo apt-get install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget`
Перейдите в `prkbot\modules\python` и установите requirements.txt для модулей питона

Для запуска `node .`

### Атоматический запуск/перезапуск

Установите PM2 - https://pm2.io/docs/runtime/guide/installation/
После, в корневой папке проекта введите `pm2 start . --name prkbot` и `pm2 save`