import { compressImage, createImageThumbnail, validateImageFile } from '@/utils/imageUtils';
import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon, Upload, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ImageUploadComponentProps {
  currentImage?: string;
  onImageChange: (imageUri: string) => void;
  onImageRemove: () => void;
  size?: number;
  showRemoveButton?: boolean;
  compressionQuality?: number;
}

export default function ImageUploadComponent({
  currentImage,
  onImageChange,
  onImageRemove,
  size = 100,
  showRemoveButton = true,
  compressionQuality = 0.8,
}: ImageUploadComponentProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          setIsUploading(true);
          
          try {
            // 파일 검증
            const validation = validateImageFile(file);
            if (!validation.valid) {
              Alert.alert('파일 오류', validation.error || '올바르지 않은 파일입니다');
              return;
            }

            // 이미지 압축
            const compressedImage = await compressImage(file, 800, compressionQuality);
            
            // 썸네일 생성 (선택사항)
            const thumbnail = await createImageThumbnail(compressedImage, size);
            
            onImageChange(thumbnail);
          } catch (error) {
            console.error('이미지 처리 오류:', error);
            Alert.alert('오류', '이미지 처리 중 오류가 발생했습니다');
          } finally {
            setIsUploading(false);
          }
        }
      };
      input.click();
    } else {
      // 모바일 갤러리 접근
      try {
        setIsUploading(true);
        
        // 갤러리 권한 요청
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.');
          return;
        }

        // 갤러리에서 이미지 선택
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: compressionQuality,
          base64: true,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
          const asset = result.assets[0];
          if (asset.base64) {
            onImageChange(`data:image/jpeg;base64,${asset.base64}`);
          } else if (asset.uri) {
            onImageChange(asset.uri);
          }
        }
      } catch (error) {
        console.error('갤러리 접근 오류:', error);
        Alert.alert('오류', '갤러리에서 이미지를 선택하는 중 오류가 발생했습니다.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const showImageOptions = () => {
    const options: any[] = [
      { text: '취소', style: 'cancel' },
      { text: '갤러리에서 선택', onPress: handleFileSelect },
    ];

    if (currentImage && showRemoveButton) {
      options.splice(-1, 0, {
        text: '사진 삭제',
        style: 'destructive',
        onPress: onImageRemove,
      });
    }

    Alert.alert('사진 선택', '어떤 방법으로 사진을 선택하시겠어요?', options);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.uploadArea,
          { width: size, height: size },
          currentImage && styles.uploadAreaWithImage,
        ]}
        onPress={showImageOptions}
        activeOpacity={0.8}
        disabled={isUploading}
      >
        {isUploading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0066FF" />
            <Text style={styles.loadingText}>처리 중...</Text>
          </View>
        ) : currentImage ? (
          <>
            <Image source={{ uri: currentImage }} style={[styles.image, { width: size, height: size }]} />
            {showRemoveButton && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={onImageRemove}
                activeOpacity={0.8}
              >
                <X size={16} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.placeholder}>
            <ImageIcon size={size * 0.3} color="#8B95A1" strokeWidth={1.5} />
            <Text style={styles.placeholderText}>사진 추가</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.uploadIcon}>
        <Upload size={16} color="#FFFFFF" strokeWidth={2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadArea: {
    borderRadius: 50,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E8EB',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  uploadAreaWithImage: {
    borderStyle: 'solid',
    borderColor: '#0066FF',
  },
  image: {
    borderRadius: 50,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#8B95A1',
    fontWeight: '500',
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: '#0066FF',
    fontWeight: '500',
    marginTop: 8,
  },
  uploadIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0066FF',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});