// Visit Detail Screen Placeholder
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '../../utils/theme';

const VisitDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { visit } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{visit.fieldName}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Visit Details</Text>
        <Text style={styles.info}>Visit ID: {visit.id}</Text>
        <Text style={styles.info}>Status: {visit.status}</Text>
        <Text style={styles.info}>Date: {visit.date}</Text>
        {visit.observations && (
          <>
            <Text style={styles.sectionTitle}>Observations</Text>
            <Text style={styles.text}>{visit.observations}</Text>
          </>
        )}
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
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  info: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  text: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
});

export default VisitDetailScreen;
