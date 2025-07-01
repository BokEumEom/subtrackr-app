import ProfileEditModal, { ProfileData } from '@/components/ProfileEditModal';
import { useProfile } from '@/hooks/useProfile';
import { Subscription } from '@/types/subscription';
import { loadSubscriptions, saveSubscriptions } from '@/utils/storage';
import { Bell, ChevronRight, Download, CreditCard as Edit, CircleHelp as HelpCircle, Info, Mail, Moon, Shield, Star, Trash2, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const PROFILE_STORAGE_KEY = 'subtrackr_profile';

export default function Settings() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // 프로필 공통 훅 사용
  const { profile, setProfile, loading: profileLoading, reload: reloadProfile } = useProfile();

  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading]);

  const loadData = async () => {
    try {
      const subscriptionsData = await loadSubscriptions();
      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 저장
  const handleProfileSave = async (newProfileData: ProfileData) => {
    await setProfile(newProfileData);
    reloadProfile();
    Alert.alert('완료', '프로필이 성공적으로 업데이트되었습니다!');
  };

  const handleExportData = () => {
    Alert.alert(
      '데이터 내보내기',
      '구독 데이터를 CSV 파일로 내보냅니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '내보내기', 
          onPress: () => {
            Alert.alert('완료', '데이터가 성공적으로 내보내졌습니다!');
          }
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      '모든 데이터 삭제',
      '모든 구독 정보가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: async () => {
            try {
              await saveSubscriptions([]);
              setSubscriptions([]);
              Alert.alert('완료', '모든 데이터가 삭제되었습니다.');
            } catch (error) {
              Alert.alert('오류', '데이터 삭제에 실패했습니다.');
            }
          }
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      '고객 지원',
      '도움이 필요하시면 support@subtrackr.app로 연락해주세요',
      [{ text: '확인' }]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      '앱 평가하기',
      '앱이 마음에 드시나요? 앱스토어에서 평가해주세요!',
      [
        { text: '나중에' },
        { text: '지금 평가하기', onPress: () => {} },
      ]
    );
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
        {/* 토스 스타일 헤더 */}
        <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>설정</Text>
              <Text style={styles.subtitle}>앱 환경을 설정해보세요</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
                <Bell size={24} color="#191F28" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* 프로필 섹션 */}
        <Animated.View style={[styles.profileSection, { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }]}>
          <TouchableOpacity 
            style={styles.profileCard}
            onPress={() => setShowProfileEdit(true)}
            activeOpacity={0.8}
          >
            <View style={styles.profileInfo}>
              <View style={styles.profileAvatarContainer}>
                {profile.profileImage ? (
                  <Image source={{ uri: profile.profileImage }} style={styles.profileAvatar} />
                ) : (
                  <View style={styles.profileAvatarPlaceholder}>
                    <User size={28} color="#0066FF" strokeWidth={2} />
                  </View>
                )}
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileEmail}>{profile.email}</Text>
              </View>
            </View>
            <View style={styles.profileEditButton}>
              <Edit size={16} color="#0066FF" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* 통계 카드 */}
        <Animated.View style={[styles.quickStats, { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }]}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{subscriptions.length}</Text>
            <Text style={styles.statLabel}>총 구독</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {subscriptions.filter(sub => sub.status === 'subscribed').length}
            </Text>
            <Text style={styles.statLabel}>활성</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {subscriptions.filter(sub => sub.status === 'cancelled').length}
            </Text>
            <Text style={styles.statLabel}>해지</Text>
          </View>
        </Animated.View>

        {/* 설정 섹션들 */}
        <Animated.View style={[styles.settingsContainer, { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }]}>
          {/* 알림 설정 */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>알림</Text>
            <View style={styles.settingCard}>
              <TouchableOpacity 
                style={styles.settingItem}
                disabled
                activeOpacity={0.8}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#0066FF15' }]}>
                    <Bell size={20} color="#0066FF" strokeWidth={2} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>푸시 알림</Text>
                    <Text style={styles.settingSubtitle}>결제 예정일 알림 받기</Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#E5E8EB', true: '#0066FF40' }}
                  thumbColor={notificationsEnabled ? '#0066FF' : '#F9FAFB'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 앱 설정 */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>앱 설정</Text>
            <View style={styles.settingCard}>
              <TouchableOpacity 
                style={styles.settingItem}
                disabled
                activeOpacity={0.8}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#8B95A115' }]}>
                    <Moon size={20} color="#8B95A1" strokeWidth={2} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>다크 모드</Text>
                    <Text style={styles.settingSubtitle}>어두운 테마 사용</Text>
                  </View>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: '#E5E8EB', true: '#8B95A140' }}
                  thumbColor={darkModeEnabled ? '#8B95A1' : '#F9FAFB'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 데이터 관리 */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>데이터 관리</Text>
            <View style={styles.settingCard}>
              <TouchableOpacity 
                style={styles.settingItem}
                onPress={handleExportData}
                activeOpacity={0.8}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#00C89615' }]}>
                    <Download size={20} color="#00C896" strokeWidth={2} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>데이터 내보내기</Text>
                    <Text style={styles.settingSubtitle}>구독 데이터 다운로드</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" strokeWidth={2} />
              </TouchableOpacity>

              <View style={styles.settingDivider} />

              <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => Alert.alert('개인정보 처리방침', '개인정보 처리방침 내용이 여기에 표시됩니다.')}
                activeOpacity={0.8}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#8B5CF615' }]}>
                    <Shield size={20} color="#8B5CF6" strokeWidth={2} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>개인정보 처리방침</Text>
                    <Text style={styles.settingSubtitle}>개인정보 보호 정책</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" strokeWidth={2} />
              </TouchableOpacity>

              <View style={styles.settingDivider} />

              <TouchableOpacity 
                style={styles.settingItem}
                onPress={handleClearData}
                activeOpacity={0.8}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#FF6B3515' }]}>
                    <Trash2 size={20} color="#FF6B35" strokeWidth={2} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, { color: '#FF6B35' }]}>모든 데이터 삭제</Text>
                    <Text style={styles.settingSubtitle}>모든 구독 정보 영구 삭제</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* 지원 */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>지원</Text>
            <View style={styles.settingCard}>
              <TouchableOpacity 
                style={styles.settingItem}
                onPress={handleContactSupport}
                activeOpacity={0.8}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#FF6B3515' }]}>
                    <HelpCircle size={20} color="#FF6B35" strokeWidth={2} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>도움말</Text>
                    <Text style={styles.settingSubtitle}>자주 묻는 질문</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" strokeWidth={2} />
              </TouchableOpacity>

              <View style={styles.settingDivider} />

              <TouchableOpacity 
                style={styles.settingItem}
                onPress={handleContactSupport}
                activeOpacity={0.8}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#8B5CF615' }]}>
                    <Mail size={20} color="#8B5CF6" strokeWidth={2} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>고객 지원</Text>
                    <Text style={styles.settingSubtitle}>문의하기</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" strokeWidth={2} />
              </TouchableOpacity>

              <View style={styles.settingDivider} />

              <TouchableOpacity 
                style={styles.settingItem}
                onPress={handleRateApp}
                activeOpacity={0.8}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#FCD34D15' }]}>
                    <Star size={20} color="#FCD34D" strokeWidth={2} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>앱 평가하기</Text>
                    <Text style={styles.settingSubtitle}>피드백 공유하기</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* 정보 */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>정보</Text>
            <View style={styles.settingCard}>
              <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => Alert.alert('앱 정보', 'SubTrackr v1.0.0\n\n토스 스타일로 제작된 아름다운 구독 지출 관리 앱입니다.')}
                activeOpacity={0.8}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#0066FF15' }]}>
                    <Info size={20} color="#0066FF" strokeWidth={2} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>앱 정보</Text>
                    <Text style={styles.settingSubtitle}>버전 1.0.0</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <View style={styles.bottomPadding} />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B95A1',
    fontWeight: '500',
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatarContainer: {
    marginRight: 16,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  profileAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8B95A1',
    marginTop: 4,
    fontWeight: '500',
  },
  profileEditButton: {
    backgroundColor: '#F0F6FF',
    borderRadius: 12,
    padding: 12,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 13,
    color: '#8B95A1',
    marginTop: 4,
    fontWeight: '500',
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
  settingSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.1,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8B95A1',
    marginTop: 2,
    fontWeight: '500',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F1F3F4',
    marginLeft: 76,
  },
  bottomPadding: {
    height: 32,
  },
});