import { Directory, File, Paths } from 'expo-file-system';

import { AppError } from '@/shared/lib/errors';

const STORMS_DIR_NAME = 'storms';

function stormsDirectory(): Directory {
  return new Directory(Paths.document, STORMS_DIR_NAME);
}

export function photoRelativePathForId(id: string): string {
  return `${STORMS_DIR_NAME}/${id}.jpg`;
}

export async function ensureStormsDirectory(): Promise<Directory> {
  const directory = stormsDirectory();

  if (!directory.exists) {
    directory.create({ intermediates: true, idempotent: true });
  }

  return directory;
}

export async function persistStormPhoto(sourceUri: string, id: string): Promise<string> {
  const directory = await ensureStormsDirectory();
  const relativePath = photoRelativePathForId(id);
  const destination = new File(directory, `${id}.jpg`);

  try {
    const source = new File(sourceUri);
    if (!source.exists) {
      throw new AppError('not_found', 'The captured photo could not be found.');
    }

    if (destination.exists) {
      destination.delete();
    }

    source.copy(destination);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('unknown', 'Unable to save the storm photo.', { cause: error });
  }

  return relativePath;
}

export function resolvePhotoUri(relativePath: string): string {
  return new File(Paths.document, relativePath).uri;
}

export async function deleteStormPhoto(relativePath: string): Promise<void> {
  const file = new File(Paths.document, relativePath);
  if (file.exists) {
    file.delete();
  }
}
