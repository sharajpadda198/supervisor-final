// VehicleCard Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Vehicle } from '../types';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';
import { getStatusColor, getStatusBackgroundColor } from '../utils/helpers';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSchedule: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSchedule }) => {
  const getVehicleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tractor':
        return 'tractor';
      case 'harvester':
        return 'grass';
      case 'sprayer':
        return 'spray';
      case 'truck':
      case 'pickup truck':
        return 'truck';
      default:
        return 'car';
    }
  };

  const getFuelColor = (level: number) => {
    if (level >= 70) return colors.success;
    if (level >= 40) return colors.warning;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.vehicleInfo}>
          <Icon name={getVehicleIcon(vehicle.type)} size={32} color={colors.primary} />
          <View style={styles.details}>
            <Text style={styles.type}>{vehicle.type}</Text>
            <Text style={styles.id}>{vehicle.registrationNumber}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor(vehicle.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(vehicle.status) }]}>
            {vehicle.status}
          </Text>
        </View>
      </View>

      <View style={styles.driverRow}>
        <Icon name="account" size={16} color={colors.textSecondary} />
        <Text style={styles.driver}>{vehicle.driver}</Text>
      </View>

      <View style={styles.locationRow}>
        <Icon name="map-marker" size={16} color={colors.textSecondary} />
        <Text style={styles.location}>{vehicle.location}</Text>
      </View>

      <View style={styles.fuelContainer}>
        <View style={styles.fuelHeader}>
          <Icon name="gas-station" size={16} color={colors.textSecondary} />
          <Text style={styles.fuelLabel}>Fuel Level</Text>
          <Text style={styles.fuelValue}>{vehicle.fuelLevel}%</Text>
        </View>
        <View style={styles.fuelBarContainer}>
          <View 
            style={[
              styles.fuelBar, 
              { 
                width: `${vehicle.fuelLevel}%`,
                backgroundColor: getFuelColor(vehicle.fuelLevel) 
              }
            ]} 
          />
        </View>
      </View>

      <TouchableOpacity style={styles.scheduleButton} onPress={onSchedule}>
        <Text style={styles.scheduleText}>Schedule</Text>
      </TouchableOpacity>
    </View>
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
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  details: {
    marginLeft: spacing.md,
  },
  type: {
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
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  driver: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  location: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  fuelContainer: {
    marginBottom: spacing.md,
  },
  fuelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  fuelLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  fuelValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  fuelBarContainer: {
    height: 8,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fuelBar: {
    height: '100%',
    borderRadius: 4,
  },
  scheduleButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.small,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  scheduleText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default VehicleCard;
