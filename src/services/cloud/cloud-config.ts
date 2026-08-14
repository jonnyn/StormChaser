import type { CloudConfig } from './types';

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

export function readCloudConfig(): CloudConfig | null {
  const provider = readEnv('EXPO_PUBLIC_CLOUD_PROVIDER');
  if (provider !== 'supabase') {
    return null;
  }

  const supabaseUrl = readEnv('EXPO_PUBLIC_SUPABASE_URL');
  const anonKey = readEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  const bucket = readEnv('EXPO_PUBLIC_CLOUD_BACKUP_BUCKET');

  if (!supabaseUrl || !anonKey || !bucket) {
    return null;
  }

  return {
    provider: 'supabase',
    supabaseUrl: supabaseUrl.replace(/\/$/, ''),
    anonKey,
    bucket,
  };
}

export function isCloudConfigured(): boolean {
  return readCloudConfig() !== null;
}
