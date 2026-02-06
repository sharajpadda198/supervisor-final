// TaskCard Component
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Task } from '../types';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';
import { getPriorityColor, getStatusColor, getStatusBackgroundColor, formatDate } from '../utils/helpers';

interface TaskCardProps {
  task: Task;
  onUpdate?: (taskId: string, status: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Cultivation':
        return 'sprout';
      case 'Driver':
        return 'truck';
      case 'Contract':
        return 'file-document';
      default:
        return 'clipboard-list';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { borderLeftColor: getPriorityColor(task.priority), borderLeftWidth: 4 }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Icon name={getTypeIcon(task.type)} size={20} color={colors.primary} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.id}>{task.id}</Text>
          </View>
        </View>
        <Icon 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={24} 
          color={colors.textSecondary} 
        />
      </View>

      <View style={styles.badges}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{task.type}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
          <Icon name="flag" size={12} color={getPriorityColor(task.priority)} />
          <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
            {task.priority}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor(task.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
            {task.status}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Icon name="calendar" size={14} color={colors.textSecondary} />
        <Text style={styles.infoText}>Due: {formatDate(task.dueDate)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="map-marker" size={14} color={colors.textSecondary} />
        <Text style={styles.infoText}>Field: {task.assignedField}</Text>
      </View>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.description}>{task.description}</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assigned to:</Text>
            <Text style={styles.detailValue}>{task.assignedTo}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date:</Text>
            <Text style={styles.detailValue}>{formatDate(task.startDate)}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressValue}>{task.progress}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${task.progress}%` }]} />
            </View>
          </View>

          {task.status !== 'Completed' && onUpdate && (
            <View style={styles.actions}>
              {task.status === 'Pending' && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => onUpdate(task.id, 'In Progress')}
                >
                  <Text style={styles.actionText}>Start</Text>
                </TouchableOpacity>
              )}
              {task.status === 'In Progress' && (
                <>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => onUpdate(task.id, 'In Progress')}
                  >
                    <Text style={styles.actionText}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.completeButton]}
                    onPress={() => onUpdate(task.id, 'Completed')}
                  >
                    <Text style={[styles.actionText, styles.completeText]}>Complete</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  titleContainer: {
    marginLeft: spacing.sm,
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
  badge: {
    backgroundColor: colors.badgeBlue,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  badgeText: {
    ...typography.small,
    color: colors.info,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  expandedContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  progressContainer: {
    marginVertical: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  progressValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.small,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  actionText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: colors.primary,
    marginRight: 0,
  },
  completeText: {
    color: colors.surface,
  },
});

export default TaskCard;
