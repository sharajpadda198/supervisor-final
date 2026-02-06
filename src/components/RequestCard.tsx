// RequestCard Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Request } from '../types';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';
import { getPriorityColor, getStatusColor, getStatusBackgroundColor, formatDate } from '../utils/helpers';

interface RequestCardProps {
  request: Request;
  onPress: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onPress }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Equipment':
        return 'tools';
      case 'Maintenance':
        return 'wrench';
      case 'Resource':
        return 'package-variant';
      case 'Personnel':
        return 'account-group';
      default:
        return 'file-document';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Equipment':
        return colors.info;
      case 'Maintenance':
        return colors.warning;
      case 'Resource':
        return colors.success;
      case 'Personnel':
        return colors.secondary;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(request.category) + '20' }]}>
            <Icon name={getCategoryIcon(request.category)} size={20} color={getCategoryColor(request.category)} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{request.title}</Text>
            <Text style={styles.id}>{request.id}</Text>
          </View>
        </View>
      </View>

      <View style={styles.badges}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(request.category) + '20' }]}>
          <Text style={[styles.categoryText, { color: getCategoryColor(request.category) }]}>
            {request.category}
          </Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(request.priority) + '20' }]}>
          <Icon name="flag" size={12} color={getPriorityColor(request.priority)} />
          <Text style={[styles.priorityText, { color: getPriorityColor(request.priority) }]}>
            {request.priority}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor(request.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
            {request.status}
          </Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <Icon name="calendar" size={14} color={colors.textSecondary} />
        <Text style={styles.dateText}>Submitted: {formatDate(request.submittedDate)}</Text>
      </View>

      {request.relatedField && (
        <View style={styles.fieldRow}>
          <Icon name="map-marker" size={14} color={colors.textSecondary} />
          <Text style={styles.fieldText}>Field: {request.relatedField}</Text>
        </View>
      )}
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
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  id: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  categoryText: {
    ...typography.small,
    fontWeight: '500',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  priorityText: {
    ...typography.small,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
    marginBottom: spacing.xs,
  },
  statusText: {
    ...typography.small,
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dateText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
});

export default RequestCard;
