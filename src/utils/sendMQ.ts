import { mqDTO } from '../interface/req/mqDTO';

export default function (key: string, msg: mqDTO) {
  // global.ch.assertExchange('direct', 'direct', {
  //   durable: false,
  // });

  //global.ch.publish('direct', key, Buffer.from(JSON.stringify(msg)));
  console.log('Send: %s', msg);
}
