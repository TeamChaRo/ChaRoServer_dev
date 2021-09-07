export default function (key: string, msg: object) {
  global.ch.assertExchange('direct_logs', 'direct', {
    durable: false,
  });

  global.ch.publish('direct_logs', key, Buffer.from(JSON.stringify(msg)));
  console.log('Send: %s', msg);
}
