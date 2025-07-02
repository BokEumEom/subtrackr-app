import { SettingSection as SettingSectionType } from '@/constants/settings';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import SettingItem from './SettingItem';

interface SettingSectionProps {
  section: SettingSectionType;
  switchValues: Record<string, boolean>;
  onSwitchChange: (id: string, value: boolean) => void;
  onItemPress: (id: string) => void;
}

export default function SettingSection({
  section,
  switchValues,
  onSwitchChange,
  onItemPress,
}: SettingSectionProps) {
  return (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.settingCard}>
        {section.items.map((item, index) => (
          <SettingItem
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            iconColor={item.iconColor}
            iconBackground={item.iconBackground}
            type={item.type}
            onPress={() => onItemPress(item.id)}
            switchValue={switchValues[item.id]}
            onSwitchChange={(value) => onSwitchChange(item.id, value)}
            isDestructive={item.isDestructive}
            disabled={item.disabled}
            showDivider={index < section.items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
}); 