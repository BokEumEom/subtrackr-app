import { Bell, User } from 'lucide-react-native';
import React from 'react';
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface TabHeaderProps {
  title: string;
  subtitle: string;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  // 우측 액션 버튼들
  rightActions?: {
    type: 'notification' | 'profile' | 'custom';
    onPress?: () => void;
    icon?: React.ReactNode;
    profileImage?: string;
  }[];
  // 커스텀 우측 컨텐츠
  rightContent?: React.ReactNode;
}

export default function TabHeader({
  title,
  subtitle,
  fadeAnim,
  slideAnim,
  rightActions = [],
  rightContent,
}: TabHeaderProps) {
  const renderRightAction = (action: NonNullable<TabHeaderProps['rightActions']>[0], index: number) => {
    switch (action.type) {
      case 'notification':
        return (
          <TouchableOpacity 
            key={`notification-${index}`}
            style={styles.iconButton} 
            onPress={action.onPress}
            activeOpacity={0.8}
          >
            <Bell size={24} color="#191F28" strokeWidth={1.5} />
          </TouchableOpacity>
        );
      
      case 'profile':
        return (
          <TouchableOpacity 
            key={`profile-${index}`}
            style={styles.iconButton} 
            onPress={action.onPress}
            activeOpacity={0.8}
          >
            {action.profileImage ? (
              <Image source={{ uri: action.profileImage }} style={styles.profileImage} />
            ) : (
              <User size={24} color="#191F28" strokeWidth={1.5} />
            )}
          </TouchableOpacity>
        );
      
      case 'custom':
        return (
          <TouchableOpacity 
            key={`custom-${index}`}
            style={styles.iconButton} 
            onPress={action.onPress}
            activeOpacity={0.8}
          >
            {action.icon}
          </TouchableOpacity>
        );
      
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.headerRight}>
          {rightContent ? (
            rightContent
          ) : (
            rightActions.map((action, index) => renderRightAction(action, index))
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E8EB',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
}); 