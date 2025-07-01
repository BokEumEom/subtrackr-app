import { Platform } from 'react-native';

export interface ImageUploadResult {
  success: boolean;
  uri?: string;
  error?: string;
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // 파일 크기 체크 (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: '파일 크기가 5MB를 초과합니다' };
  }

  // 파일 형식 체크
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: '지원하지 않는 파일 형식입니다 (JPG, PNG, WebP만 지원)' };
  }

  return { valid: true };
};

export const compressImage = (
  file: File, 
  maxWidth: number = 800, 
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 비율 유지하면서 리사이즈
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // 이미지 그리기
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Base64로 변환
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => reject(new Error('이미지 로딩 실패'));
    img.src = URL.createObjectURL(file);
  });
};

export const getImageDimensions = (uri: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'web') {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => reject(new Error('이미지 로딩 실패'));
      img.src = uri;
    } else {
      // 모바일에서는 expo-image-manipulator 사용 권장
      resolve({ width: 0, height: 0 });
    }
  });
};

export const createImageThumbnail = (
  uri: string, 
  size: number = 150
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'web') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        // 정사각형으로 크롭
        const minDimension = Math.min(img.width, img.height);
        const x = (img.width - minDimension) / 2;
        const y = (img.height - minDimension) / 2;

        ctx?.drawImage(
          img, 
          x, y, minDimension, minDimension,
          0, 0, size, size
        );

        const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnailDataUrl);
      };

      img.onerror = () => reject(new Error('썸네일 생성 실패'));
      img.src = uri;
    } else {
      resolve(uri); // 모바일에서는 원본 반환
    }
  });
};