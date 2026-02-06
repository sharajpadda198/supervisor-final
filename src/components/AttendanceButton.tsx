// AttendanceButton Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';
import { formatElapsedTime, formatTime } from '../utils/helpers';

interface AttendanceButtonProps {
  isCheckedIn: boolean;
  checkInTime?: string;
  elapsedTime: number;
  onPress: () => void;
  userName: string;
}

const AttendanceButton: React.FC<AttendanceButtonProps> = ({
  isCheckedIn,
  checkInTime,
  elapsedTime,
  onPress,
  userName,
}) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Icon name="account-circle" size={24} color={colors.surface} />
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>
          {isCheckedIn ? 'Time Elapsed' : 'Ready to Check In'}
        </Text>
        <Text style={styles.timer}>
          {isCheckedIn ? formatElapsedTime(elapsedTime) : '00:00:00'}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: isCheckedIn ? '#fbbf24' : colors.textDisabled }]} />
        <Text style={styles.statusText}>
          {isCheckedIn ? 'ON DUTY' : 'OFF DUTY'}
        </Text>
      </View>

      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <View style={styles.iconCircle}>
            <Icon 
              name={isCheckedIn ? 'stop' : 'play'} 
              size={32} 
              color={colors.primary} 
            />
          </View>
          <Text style={styles.buttonText}>
            {isCheckedIn ? 'CHECK OUT' : 'CHECK IN'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {isCheckedIn && checkInTime && (
        <View style={styles.infoBar}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Check In</Text>
            <Text style={styles.infoValue}>{formatTime(checkInTime)}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Today's Time</Text>
            <Text style={styles.infoValue}>
              {Math.floor(elapsedTime / 3600)}h {Math.floor((elapsedTime % 3600) / 60)}m
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    ...typography.h4,
    color: colors.surface,
    marginLeft: spacing.sm,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timerLabel: {
    ...typography.caption,
    color: colors.surface,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.surface,
    fontVariant: ['tabular-nums'],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '600',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    width: 192,
    height: 192,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buttonText: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoBar: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surface + '30',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    ...typography.small,
    color: colors.surface,
    opacity: 0.8,
    marginBottom: 4,
  },
  infoValue: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
  infoDivider: {
    width: 1,
    backgroundColor: colors.surface + '30',
    marginHorizontal: spacing.md,
  },
});

export default AttendanceButton;
