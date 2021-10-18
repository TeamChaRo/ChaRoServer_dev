import amqp from 'amqplib';

const connectMQ = async () => {
  try {
    await amqp.connect('amqp://127.0.0.1').then(async (conn) => {
      console.log('connect MQ');

      // global 변수로 채널 두기.
      global.ch = await conn.createChannel();

      conn.on('error', (error) => {
        if (error.message !== 'Connection closing') {
          console.log('[AMQP] conn error', error.message);
        }
      });

      conn.on('close', () => {
        console.log('[AMQP] reconnecting');
        setTimeout(() => {
          amqp.connect('amqp://127.0.0.1', (error, connection) => {
            if (error) {
              console.log('[AMQP] reconnecting failed');
            } else {
              console.log('[AMQP] reconnected');
              global.ch = connection.createChannel();
            }
          });
        }, 1000);
      });
    });
  } catch (e) {
    console.error('failed to create amqp channel: ', e);
  }
};

export default connectMQ;
