const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

const messages = []; // История сообщений в памяти

wss.on('connection', (ws) => {
  console.log('Новое соединение');

  // Отправляем историю сообщений новому клиенту
  ws.send(JSON.stringify({ type: 'history', data: messages }));

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    messages.push(parsedMessage); // Сохраняем сообщение в историю

    // Рассылаем сообщение всем подключенным клиентам
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'message', data: parsedMessage }));
      }
    });
  });
});