import { Client } from 'discord-rpc';
import { Logger } from './utils/logger';
import retry from 'async-retry';

const clientId: string = '694558978776105000';
const logger: Logger = new Logger('discord');
const ELAPSE_UPDATE_DURATION: number = 10000;

const setActivity = (client: Client, startTimestamp: number) => {
  const details = "";
  const state = "";

  client.setActivity({ state, details, startTimestamp, instance: false });
};

const activate = () => {
  logger.info('Starting coc-discord...');
  const startTimestamp = Date.now();

  const discordRpcClient = new Client({ transport: 'ipc' });
  discordRpcClient.on('ready', () => {
    setActivity(discordRpcClient, startTimestamp);
    setInterval(() => setActivity(discordRpcClient, startTimestamp), ELAPSE_UPDATE_DURATION);
    logger.info(`Started coc-discord client. Updating activity every ${ELAPSE_UPDATE_DURATION / 1000}s.`);
  });

  retry(
    async(bail) => {
      try {
        await discordRpcClient.connect( clientId );
        await discordRpcClient.login({ clientId });
      } catch (err) {
        bail(err);
      }
    },{
      retries: 10000000,
      factor: 3,
      minTimeout: 1 * 1000,
      maxTimeout: 15 * 1000,
      randomize: true,
    }
  )
};

export { activate };
