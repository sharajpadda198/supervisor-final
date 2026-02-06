// FieldCard Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Field } from '../types';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';
import { getStatusColor, getStatusBackgroundColor } from '../utils/helpers';

interface FieldCardProps {
  field: Field;
  onPress: () => void;
}

const FieldCard: React.FC<FieldCardProps> = ({ field, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{field.name}</Text>
          <Text style={styles.id}>{field.id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor(field.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(field.status) }]}>
            {field.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Icon name="vector-square" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{field.area}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoItem}>
          <Icon name="sprout" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{field.crop}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.mapButton} onPress={onPress}>
        <Icon name="map-marker" size={18} color={colors.primary} />
        <Text style={styles.mapText}>Click to view on map</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  id: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  mapText: {
    ...typography.caption,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
});

export default FieldCard;
