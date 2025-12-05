import { getMooseClients, Sql } from '@514labs/moose-lib';

const globalForMoose = globalThis as unknown as {
  mooseClient: Awaited<ReturnType<typeof getMooseClients>> | undefined;
};

export const getMoose = async () => {
  if (globalForMoose.mooseClient) return globalForMoose.mooseClient;

  try {
    const client = await getMooseClients({
      database: process.env.MOOSE_CLICKHOUSE_CONFIG__DB_NAME,
      host: process.env.MOOSE_CLICKHOUSE_CONFIG__HOST,
      port: process.env.MOOSE_CLICKHOUSE_CONFIG__PORT,
      username: process.env.MOOSE_CLICKHOUSE_CONFIG__USER,
      password: process.env.MOOSE_CLICKHOUSE_CONFIG__PASSWORD,
      useSSL: process.env.MOOSE_CLICKHOUSE_CONFIG__USE_SSL === 'true'
    });

    if (process.env.NODE_ENV !== 'production') {
      globalForMoose.mooseClient = client;
    }
    return client;
  } catch (error) {
    console.warn('Failed to connect to Moose/ClickHouse', error);
    return null;
  }
};

export async function executeQuery<T>(query: Sql): Promise<T> {
  const moose = await getMoose();
  if (!moose) throw new Error('Failed to connect to Moose/ClickHouse');
  try {
    const result = await moose.client.query.execute(query);
    return result.json() as T;
  } catch (e) {
    console.warn('Query failed, using fallback:', e);
    throw new Error('Query failed' + e);
  }
}
