const { WebSocketServer } = require('ws');
const http = require('http');
const uuidv4 = require('uuid').v4;
const Redis = require('ioredis');

const redis = new Redis({
  host: '127.0.0.1',
  port: 6378, 
  maxRetriesPerRequest: 5,
});

redis.on('connect', () => {
  console.log('Redis client connected');
});

const server = http.createServer();
const PORT = 8000;
const wsServer = new WebSocketServer({ server });

wsServer.on('connection', (connection) => {
  console.log("Client connected");

  connection.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      const { amount, stockname } = data;

      await redis.xadd(
        'orders',
        '*',
        'type', stockname,
        'amount', amount.toString()
      );

      console.log(`Order saved: ${stockname} - ${amount}`);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
