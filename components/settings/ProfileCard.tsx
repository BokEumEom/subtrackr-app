import { ProfileData } from '@/components/ProfileEditModal';
import { UserRoundPen as Edit, User } from 'lucide-react-native';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProfileCardProps {
  profile: ProfileData;
  onPress: () => void;
}

export default function ProfileCard({ profile, onPress }: ProfileCardProps) {
  return (
    <TouchableOpacity 
      style={styles.profileCard}
      onPress={onPress}
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
  );
}

const styles = StyleSheet.create({
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
}); 