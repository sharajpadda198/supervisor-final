// Field Visit List Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';
import { mockFieldVisits } from '../../utils/mockData';
import { formatDate, formatTime } from '../../utils/helpers';
import { FieldVisit } from '../../types';

const FieldVisitListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [expandedSection, setExpandedSection] = useState<'pending' | 'completed'>('pending');

  const pendingVisits = mockFieldVisits.filter(v => v.status === 'Pending');
  const completedVisits = mockFieldVisits.filter(v => v.status === 'Completed');

  const renderVisitCard = (visit: FieldVisit) => {
    const isPending = visit.status === 'Pending';

    return (
      <TouchableOpacity
        key={visit.id}
        style={styles.visitCard}
        onPress={() => navigation.navigate('VisitDetail', { visit })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitle}>
            <Icon name="map-marker" size={20} color={colors.primary} />
            <Text style={styles.fieldName}>{visit.fieldName}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: isPending ? colors.badgeOrange : colors.badgeGreen }]}>
            <Text style={[styles.statusText, { color: isPending ? colors.statusPending : colors.statusCompleted }]}>
              {visit.status}
            </Text>
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Icon name="calendar" size={14} color={colors.textSecondary} />
          <Text style={styles.infoText}>{formatDate(visit.date)} at {formatTime(visit.time)}</Text>
        </View>
        {!isPending && visit.cropCondition && (
          <View style={styles.conditionRow}>
            <Icon name="sprout" size={14} color={colors.success} />
            <Text style={styles.conditionText}>Condition: {visit.cropCondition}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>{isPending ? 'Start Visit' : 'View Details'}</Text>
          <Icon name="chevron-right" size={20} color={colors.primary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Field Visits</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NewVisit')}>
          <Icon name="plus-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{mockFieldVisits.length}</Text>
          <Text style={styles.statLabel}>Total Visits</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.badgeOrange }]}>
          <Text style={styles.statValue}>{pendingVisits.length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.badgeGreen }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="check-circle" size={20} color={colors.success} style={{ marginRight: 4 }} />
            <Text style={styles.statValue}>{completedVisits.length}</Text>
          </View>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setExpandedSection(expandedSection === 'pending' ? 'completed' : 'pending')}
        >
          <Text style={styles.sectionTitle}>Pending Visits ({pendingVisits.length})</Text>
          <Icon
            name={expandedSection === 'pending' ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        {expandedSection === 'pending' && pendingVisits.map(renderVisitCard)}

        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setExpandedSection(expandedSection === 'completed' ? 'pending' : 'completed')}
        >
          <Text style={styles.sectionTitle}>Completed Visits ({completedVisits.length})</Text>
          <Icon
            name={expandedSection === 'completed' ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        {expandedSection === 'completed' && completedVisits.map(renderVisitCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.small,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    ...shadows.small,
  },
  statValue: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  visitCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fieldName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
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
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  conditionText: {
    ...typography.caption,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  actionText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default FieldVisitListScreen;
