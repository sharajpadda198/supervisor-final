// LabourCard Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Labour } from '../types';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';
import { getStatusColor, getStatusBackgroundColor, makePhoneCall } from '../utils/helpers';

interface LabourCardProps {
  labour: Labour;
  onPress: () => void;
}

const LabourCard: React.FC<LabourCardProps> = ({ labour, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="account" size={32} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{labour.name}</Text>
          <Text style={styles.role}>{labour.role}</Text>
          <Text style={styles.field}>Field: {labour.assignedField}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor(labour.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(labour.status) }]}>
            {labour.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.phoneButton} 
          onPress={(e) => {
            e.stopPropagation();
            makePhoneCall(labour.phone);
          }}
        >
          <Icon name="phone" size={18} color={colors.primary} />
          <Text style={styles.phoneText}>{labour.phone}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  role: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  field: {
    ...typography.small,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
  },
  statusText: {
    ...typography.small,
    fontWeight: '600',
  },
  footer: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    ...typography.caption,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
});

export default LabourCard;
