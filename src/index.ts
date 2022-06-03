import { workspace } from 'coc.nvim';
import { Client } from 'discord-rpc';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { Logger } from './utils/logger';

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
  const discordRpcClient = new Client({ transport: 'ipc' });

  discordRpcClient.connect(clientId);
  discordRpcClient.login({ clientId }).catch((e) => logger.error(e));

  const startTimestamp = Date.now();

  discordRpcClient.on('ready', () => {
    setActivity(discordRpcClient, startTimestamp);
    setInterval(() => setActivity(discordRpcClient, startTimestamp), ELAPSE_UPDATE_DURATION);
    logger.info(`Started coc-discord client. Updating activity every ${ELAPSE_UPDATE_DURATION / 1000}s.`);
  });
};

export { activate };
