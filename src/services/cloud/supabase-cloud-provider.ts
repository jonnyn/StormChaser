import * as Crypto from 'expo-crypto';
import { File, Paths } from 'expo-file-system';

import { AppError } from '@/shared/lib/errors';

import { backupObjectPrefix } from './backup-manifest';
import type { BackupManifest, CloudBackupProvider, CloudBackupResult, CloudConfig } from './types';

type UploadObject = (
  config: CloudConfig,
  objectPath: string,
  body: BodyInit,
  contentType: string
) => Promise<void>;

type GetPhotoBody = (relativePath: string) => BodyInit | Promise<BodyInit>;

type UploadDeps = {
  uploadObject: UploadObject;
  getPhotoBody: GetPhotoBody;
};

function buildObjectUrl(config: CloudConfig, objectPath: string): string {
  const encodedPath = objectPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `${config.supabaseUrl}/storage/v1/object/${config.bucket}/${encodedPath}`;
}

async function defaultUploadObject(
  config: CloudConfig,
  objectPath: string,
  body: BodyInit,
  contentType: string
): Promise<void> {
  const response = await fetch(buildObjectUrl(config, objectPath), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': contentType,
    },
    body,
  });

  if (!response.ok) {
    throw new AppError('http_error', 'Cloud backup upload failed.', { status: response.status });
  }
}

async function defaultGetPhotoBody(relativePath: string): Promise<BodyInit> {
  const file = new File(Paths.document, relativePath);
  if (!file.exists) {
    throw new AppError('not_found', 'A storm photo could not be found for backup.');
  }

  return file;
}

async function uploadManifest(
  config: CloudConfig,
  uploadObject: UploadObject,
  objectPath: string,
  manifest: BackupManifest
): Promise<void> {
  await uploadObject(config, objectPath, JSON.stringify(manifest), 'application/json');
}

async function uploadPhoto(
  config: CloudConfig,
  uploadObject: UploadObject,
  getPhotoBody: GetPhotoBody,
  objectPath: string,
  relativePath: string
): Promise<void> {
  const body = await getPhotoBody(relativePath);
  await uploadObject(config, objectPath, body, 'image/jpeg');
}

export function createSupabaseCloudProvider(
  config: CloudConfig,
  deps: UploadDeps = {
    uploadObject: defaultUploadObject,
    getPhotoBody: defaultGetPhotoBody,
  }
): CloudBackupProvider {
  const { uploadObject, getPhotoBody } = deps;

  return {
    async uploadBackup(manifest, photoPaths): Promise<CloudBackupResult> {
      const batchId = Crypto.randomUUID();
      const prefix = backupObjectPrefix(batchId);

      await uploadManifest(config, uploadObject, `${prefix}/manifest.json`, manifest);

      let uploadedCount = 1;

      for (const [observationId, relativePath] of photoPaths) {
        await uploadPhoto(
          config,
          uploadObject,
          getPhotoBody,
          `${prefix}/photos/${observationId}.jpg`,
          relativePath
        );
        uploadedCount += 1;
      }

      return {
        batchId,
        uploadedCount,
        observationCount: manifest.observationCount,
      };
    },
  };
}
