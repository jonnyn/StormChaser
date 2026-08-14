import { readCloudConfig } from './cloud-config';
import { createSupabaseCloudProvider } from './supabase-cloud-provider';
import type { CloudBackupProvider } from './types';

export function createCloudProvider(): CloudBackupProvider | null {
  const config = readCloudConfig();
  if (!config) {
    return null;
  }

  return createSupabaseCloudProvider(config);
}
