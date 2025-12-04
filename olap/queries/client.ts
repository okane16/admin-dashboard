import { getMooseClients } from '@514labs/moose-lib';

const globalForMoose = globalThis as unknown as {
  mooseClient: Awaited<ReturnType<typeof getMooseClients>> | undefined;
};

export const getMoose = async () => {
  if (globalForMoose.mooseClient) return globalForMoose.mooseClient;

  // Create client with shorter timeout for demo if possible, or handle connection error later
  try {
    const client = await getMooseClients({
      database: 'local',
      host: 'localhost',
      port: '18123',
      username: 'panda',
      password: 'pandapass',
      useSSL: false
    });

    if (process.env.NODE_ENV !== 'production') {
      globalForMoose.mooseClient = client;
    }
    return client;
  } catch (error) {
    console.warn(
      'Failed to connect to Moose/ClickHouse, using mock mode:',
      error
    );
    return null;
  }
};

export async function executeQuery<T>(query: any): Promise<T> {
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
