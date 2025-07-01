import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Calendar, Camera, Image as ImageIcon, Mail, Phone, RotateCcw, Trash2, User, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (profileData: ProfileData) => void;
  initialData?: ProfileData;
}

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  profileImage?: string;
}

export default function ProfileEditModal({ visible, onClose, onSave, initialData }: ProfileEditModalProps) {
  const [name, setName] = useState(initialData?.name || '토스뱅크님');
  const [email, setEmail] = useState(initialData?.email || 'user@example.com');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const [profileImage, setProfileImage] = useState(initialData?.profileImage || '');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const cameraRef = useRef<any>(null);
  
  // Animated.Value를 useRef로 관리하여 재생성 방지
  const slideAnim = useRef(new Animated.Value(300)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // initialData가 변경될 때만 state 업데이트
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '토스뱅크님');
      setEmail(initialData.email || 'user@example.com');
      setPhone(initialData.phone || '');
      setBirthDate(initialData.birthDate || '');
      setProfileImage(initialData.profileImage || '');
    }
  }, [initialData?.name, initialData?.email, initialData?.phone, initialData?.birthDate, initialData?.profileImage]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, overlayAnim, slideAnim]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (showCamera) {
        setShowCamera(false);
      }
    };
  }, [showCamera]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('입력 확인', '이름을 입력해주세요');
      return;
    }

    if (!email.trim()) {
      Alert.alert('입력 확인', '이메일을 입력해주세요');
      return;
    }

    const profileData: ProfileData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      birthDate: birthDate.trim(),
      profileImage,
    };

    onSave(profileData);
    onClose();
  };

  const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { valid: false, error: '파일 크기가 5MB를 초과합니다' };
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'JPG, PNG, WebP 형식만 지원됩니다' };
    }

    return { valid: true };
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (Platform.OS !== 'web') {
        reject(new Error('이미지 압축은 웹에서만 지원됩니다'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new (window as any).Image();

      img.onload = () => {
        const maxSize = 800;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedDataUrl);
      };

      img.onerror = () => reject(new Error('이미지 처리 실패'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handlePhotoLibrary = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          setIsUploading(true);
          
          try {
            const validation = validateImageFile(file);
            if (!validation.valid) {
              Alert.alert('파일 오류', validation.error || '올바르지 않은 파일입니다');
              return;
            }

            const compressedImage = await compressImage(file);
            setProfileImage(compressedImage);
          } catch (error) {
            console.error('이미지 처리 오류:', error);
            Alert.alert('오류', '이미지 처리 중 오류가 발생했습니다');
          } finally {
            setIsUploading(false);
            // 메모리 정리
            if (input) {
              input.remove();
            }
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
          quality: 0.8,
          base64: true,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
          const asset = result.assets[0];
          if (asset.base64) {
            setProfileImage(`data:image/jpeg;base64,${asset.base64}`);
          } else if (asset.uri) {
            setProfileImage(asset.uri);
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

  const handleCameraPress = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('알림', '웹에서는 카메라 기능이 제한됩니다. 갤러리에서 사진을 선택해주세요.');
      handlePhotoLibrary();
      return;
    }

    try {
      // 권한 상태 확인 및 요청
      if (!permission?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          Alert.alert('권한 필요', '카메라 권한이 필요합니다. 설정에서 권한을 허용해주세요.');
          return;
        }
      }

      setShowCamera(true);
    } catch (error) {
      console.error('카메라 권한 요청 오류:', error);
      Alert.alert('오류', '카메라 권한 요청 중 오류가 발생했습니다.');
    }
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      '사진 삭제',
      '프로필 사진을 삭제하시겠어요?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => setProfileImage('')
        },
      ]
    );
  };

  const showImageOptions = () => {
    const options: any[] = [
      { text: '취소', style: 'cancel' },
    ];

    // 웹에서는 갤러리만, 모바일에서는 카메라와 갤러리 모두
    if (Platform.OS === 'web') {
      options.push({ text: '갤러리에서 선택', onPress: handlePhotoLibrary });
    } else {
      options.push(
        { text: '카메라로 촬영', onPress: handleCameraPress },
        { text: '갤러리에서 선택', onPress: handlePhotoLibrary }
      );
    }

    // 현재 사진이 있으면 삭제 옵션 추가
    if (profileImage) {
      options.splice(-1, 0, { 
        text: '사진 삭제', 
        style: 'destructive',
        onPress: handleRemovePhoto
      });
    }

    Alert.alert('프로필 사진 변경', '어떤 방법으로 사진을 선택하시겠어요?', options);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsUploading(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          skipProcessing: false,
        });
        
        if (photo.base64) {
          setProfileImage(`data:image/jpeg;base64,${photo.base64}`);
        } else if (photo.uri) {
          setProfileImage(photo.uri);
        }
        
        setShowCamera(false);
      } catch (error) {
        console.error('사진 촬영 오류:', error);
        Alert.alert('오류', '사진 촬영에 실패했습니다');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const toggleCameraFacing = () => {
    setCameraFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // 카메라 모달
  if (showCamera && Platform.OS !== 'web') {
    return (
      <Modal visible={true} animationType="slide">
        <View style={styles.cameraContainer}>
          <CameraView 
            style={styles.camera} 
            facing={cameraFacing}
            ref={cameraRef}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraHeader}>
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={() => setShowCamera(false)}
                  activeOpacity={0.8}
                >
                  <X size={24} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.cameraTitle}>프로필 사진 촬영</Text>
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={toggleCameraFacing}
                  activeOpacity={0.8}
                >
                  <RotateCcw size={24} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.cameraFooter}>
                <TouchableOpacity 
                  style={styles.captureButton}
                  onPress={takePicture}
                  activeOpacity={0.8}
                  disabled={isUploading}
                >
                  <View style={styles.captureButtonInner}>
                    {isUploading ? (
                      <ActivityIndicator size="large" color="#FFFFFF" />
                    ) : (
                      <Camera size={32} color="#FFFFFF" strokeWidth={2} />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="none" transparent>
      <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
            {/* 토스 스타일 헤더 */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.8}>
                <X size={24} color="#8B95A1" strokeWidth={2} />
              </TouchableOpacity>
              <Text style={styles.title}>프로필 편집</Text>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton} activeOpacity={0.8}>
                <Text style={styles.saveButtonText}>완료</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.form}>
                {/* 프로필 사진 */}
                <View style={styles.profileImageSection}>
                  <View style={styles.profileImageWrapper}>
                    <TouchableOpacity 
                      style={styles.profileImageContainer}
                      onPress={showImageOptions}
                      activeOpacity={0.8}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <View style={styles.profileImagePlaceholder}>
                          <ActivityIndicator size="large" color="#0066FF" />
                          <Text style={styles.uploadingText}>처리 중...</Text>
                        </View>
                      ) : profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                      ) : (
                        <View style={styles.profileImagePlaceholder}>
                          <User size={32} color="#8B95A1" strokeWidth={2} />
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* 편집 버튼 */}
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={showImageOptions}
                      activeOpacity={0.8}
                      disabled={isUploading}
                    >
                      <ImageIcon size={16} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>

                    {/* 삭제 버튼 (사진이 있을 때만) */}
                    {profileImage && !isUploading && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleRemovePhoto}
                        activeOpacity={0.8}
                      >
                        <Trash2 size={14} color="#FFFFFF" strokeWidth={2} />
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text style={styles.profileImageText}>프로필 사진 변경</Text>
                  <Text style={styles.profileImageSubtext}>
                    {Platform.OS === 'web' 
                      ? '갤러리에서 선택하거나 위 버튼을 눌러주세요' 
                      : '카메라 또는 갤러리에서 선택하세요'}
                  </Text>
                </View>

                {/* 이름 */}
                <View style={styles.field}>
                  <Text style={styles.label}>이름</Text>
                  <View style={styles.inputContainer}>
                    <User size={20} color="#8B95A1" strokeWidth={2} />
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="이름을 입력하세요"
                      placeholderTextColor="#8B95A1"
                    />
                  </View>
                </View>

                {/* 이메일 */}
                <View style={styles.field}>
                  <Text style={styles.label}>이메일</Text>
                  <View style={styles.inputContainer}>
                    <Mail size={20} color="#8B95A1" strokeWidth={2} />
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="이메일을 입력하세요"
                      placeholderTextColor="#8B95A1"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* 전화번호 */}
                <View style={styles.field}>
                  <Text style={styles.label}>전화번호</Text>
                  <View style={styles.inputContainer}>
                    <Phone size={20} color="#8B95A1" strokeWidth={2} />
                    <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="전화번호를 입력하세요"
                      placeholderTextColor="#8B95A1"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* 생년월일 */}
                <View style={styles.field}>
                  <Text style={styles.label}>생년월일</Text>
                  <View style={styles.inputContainer}>
                    <Calendar size={20} color="#8B95A1" strokeWidth={2} />
                    <TextInput
                      style={styles.input}
                      value={birthDate}
                      onChangeText={setBirthDate}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#8B95A1"
                    />
                  </View>
                </View>

                {/* 안내 메시지 */}
                <View style={styles.infoCard}>
                  <Text style={styles.infoTitle}>📸 사진 업로드 안내</Text>
                  <Text style={styles.infoText}>
                    • 최대 5MB 크기의 이미지를 업로드할 수 있습니다{'\n'}• JPG, PNG, WebP 형식을 지원합니다{'\n'}• 정사각형 비율의 사진을 권장합니다{'\n'}• 프로필 사진을 터치하여 변경할 수 있습니다{'\n'}• 입력하신 정보는 안전하게 보호됩니다
                  </Text>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 18,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  saveButton: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#E5E8EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingText: {
    fontSize: 12,
    color: '#0066FF',
    fontWeight: '600',
    marginTop: 8,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0066FF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  profileImageText: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  profileImageSubtext: {
    fontSize: 13,
    color: '#8B95A1',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E8EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#191F28',
    fontWeight: '500',
    marginLeft: 12,
  },
  infoCard: {
    backgroundColor: '#F0F6FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E0EFFF',
  },
  infoTitle: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#4E5968',
    lineHeight: 18,
    fontWeight: '500',
  },
  // 카메라 스타일
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  cameraButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 12,
  },
  cameraTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cameraFooter: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  captureButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureButtonInner: {
    backgroundColor: '#0066FF',
    borderRadius: 40,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});