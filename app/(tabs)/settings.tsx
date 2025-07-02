import ProfileEditModal, { ProfileData } from '@/components/ProfileEditModal';
import TabHeader from '@/components/common/TabHeader';
import ProfileCard from '@/components/settings/ProfileCard';
import SettingSection from '@/components/settings/SettingSection';
import StatsCard from '@/components/settings/StatsCard';
import { SETTINGS_SECTIONS } from '@/constants/settings';
import { usePageAnimation } from '@/hooks/usePageAnimation';
import { useProfile } from '@/hooks/useProfile';
import { useSettings } from '@/hooks/useSettings';
import React, { useState } from 'react';
import {
  Alert, Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function Settings() {
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // 커스텀 훅 사용
  const { profile, setProfile, loading: profileLoading, reload: reloadProfile } = useProfile();
  const { subscriptions, isLoading, switchValues, handleSwitchChange, handleItemPress } = useSettings();
  const { fadeAnim, slideAnim } = usePageAnimation(isLoading);

  // 프로필 저장
  const handleProfileSave = async (newProfileData: ProfileData) => {
    await setProfile(newProfileData);
    reloadProfile();
    Alert.alert('완료', '프로필이 성공적으로 업데이트되었습니다!');
  };

  if (isLoading || profileLoading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingSpinner, {
            transform: [{
              rotate: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              })
            }]
          }]} />
          <Text style={styles.loadingText}>잠시만요</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* 공통 헤더 사용 */}
        <TabHeader
          title="설정"
          subtitle="앱 환경을 설정해보세요"
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          rightActions={[
            {
              type: 'notification',
              onPress: () => console.log('알림'),
            },
          ]}
        />

        {/* 프로필 섹션 */}
        <Animated.View style={[styles.profileSection, { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }]}>
          <ProfileCard
            profile={profile}
            onPress={() => setShowProfileEdit(true)}
          />
        </Animated.View>

        {/* 통계 카드 */}
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }}>
          <StatsCard subscriptions={subscriptions} />
        </Animated.View>

        {/* 설정 섹션들 */}
        <Animated.View style={[styles.settingsContainer, { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }]}>
          {SETTINGS_SECTIONS.map((section) => (
            <SettingSection
              key={section.id}
              section={section}
              switchValues={switchValues}
              onSwitchChange={handleSwitchChange}
              onItemPress={handleItemPress}
            />
          ))}
        </Animated.View>
      </Animated.ScrollView>

      <ProfileEditModal
        visible={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
        onSave={handleProfileSave}
        initialData={profile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingSpinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    borderTopColor: '#0066FF',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#4E5968',
    fontWeight: '600',
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
});