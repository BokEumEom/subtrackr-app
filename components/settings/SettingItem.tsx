import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SettingItemProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  iconBackground: string;
  type: 'switch' | 'navigation' | 'action';
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  isDestructive?: boolean;
  disabled?: boolean;
  showDivider?: boolean;
}

export default function SettingItem({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBackground,
  type,
  onPress,
  switchValue,
  onSwitchChange,
  isDestructive = false,
  disabled = false,
  showDivider = false,
}: SettingItemProps) {
  const renderRightContent = () => {
    switch (type) {
      case 'switch':
        return (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#E5E8EB', true: `${iconColor}40` }}
            thumbColor={switchValue ? iconColor : '#F9FAFB'}
            disabled={disabled}
          />
        );
      case 'navigation':
      case 'action':
        return <ChevronRight size={20} color="#CBD5E1" strokeWidth={2} />;
      default:
        return null;
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.settingItem, disabled && styles.settingItemDisabled]}
        onPress={onPress}
        disabled={disabled || type === 'switch'}
        activeOpacity={0.8}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.settingIcon, { backgroundColor: iconBackground }]}>
            <Icon size={20} color={iconColor} strokeWidth={2} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[
              styles.settingTitle,
              isDestructive && styles.settingTitleDestructive
            ]}>
              {title}
            </Text>
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          </View>
        </View>
        {renderRightContent()}
      </TouchableOpacity>
      {showDivider && <View style={styles.settingDivider} />}
    </>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingItemDisabled: {
    opacity: 0.6,
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
  settingTitleDestructive: {
    color: '#FF6B35',
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
}); 