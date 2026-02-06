// Tasks Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import TaskCard from '../../components/TaskCard';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';
import { mockTasks } from '../../utils/mockData';
import { Task } from '../../types';

const TasksScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');

  const filteredTasks = tasks.filter(task => 
    selectedFilter === 'All' || task.status === selectedFilter
  );

  const handleTaskUpdate = (taskId: string, newStatus: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus as Task['status'], progress: newStatus === 'Completed' ? 100 : task.progress }
          : task
      )
    );
    Toast.show({
      type: 'success',
      text1: 'Task Updated',
      text2: `Task status changed to ${newStatus}`,
    });
  };

  const renderFilterChip = (filter: typeof selectedFilter) => (
    <TouchableOpacity
      key={filter}
      style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[styles.filterChipText, selectedFilter === filter && styles.filterChipTextActive]}>
        {filter}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {(['All', 'Pending', 'In Progress', 'Completed'] as const).map(renderFilterChip)}
      </ScrollView>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onUpdate={handleTaskUpdate} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="clipboard-off" size={64} color={colors.textDisabled} />
            <Text style={styles.emptyText}>No tasks found</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 80 }} />}
      />

      <TouchableOpacity style={styles.fab}>
        <Icon name="plus" size={28} color={colors.surface} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filtersContainer: {
    backgroundColor: colors.surface,
    ...shadows.small,
  },
  filtersContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.surface,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textDisabled,
    marginTop: spacing.md,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
    elevation: 8,
  },
});

export default TasksScreen;
