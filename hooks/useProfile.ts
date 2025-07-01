import { ProfileData } from '@/components/ProfileEditModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const PROFILE_STORAGE_KEY = 'subtrackr_profile';

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // 프로필 불러오기
  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const profileString = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (profileString) {
        setProfile(JSON.parse(profileString));
      } else {
        setProfile({
          name: '김멍한님',
          email: 'user@example.com',
          phone: '',
          birthDate: '',
          profileImage: '',
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 프로필 저장
  const saveProfile = useCallback(async (newProfile: ProfileData) => {
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    setProfile(newProfile);
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { profile, setProfile: saveProfile, loading, reload: loadProfile };
} 