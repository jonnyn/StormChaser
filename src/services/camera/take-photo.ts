import type { CameraView } from 'expo-camera';

import { AppError } from '@/shared/lib/errors';

export async function takePhoto(camera: CameraView): Promise<string> {
  try {
    const photo = await camera.takePictureAsync({
      quality: 0.8,
      skipProcessing: false,
    });

    if (!photo?.uri) {
      throw new AppError('not_found', 'The camera did not return a photo.');
    }

    return photo.uri;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('unknown', 'Unable to capture a photo.', { cause: error });
  }
}
