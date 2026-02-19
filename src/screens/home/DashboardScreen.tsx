// Dashboard/Home Screen — Map + Land Mapping + Today's Leads
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE, Region, MapPressEvent } from 'react-native-maps';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../context/AuthContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';
import { createLead, getMyLeads } from '../../utils/api';

type LatLng = { latitude: number; longitude: number };

const DEFAULT_REGION: Region = {
  latitude: 21.1458,
  longitude: 79.0882,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState<LatLng | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);

  // Land-mapping mode
  const [mappingMode, setMappingMode] = useState(false);
  const [plotPoints, setPlotPoints] = useState<LatLng[]>([]);
  const [saving, setSaving] = useState(false);

  // Leads list
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [search, setSearch] = useState('');

  // ── Location helpers ──────────────────────────────────────
  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      const fine =
        result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;
      const coarse =
        result[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;
      return fine || coarse;
    } catch (e) {
      return false;
    }
  }, []);

  const goToMyLocation = useCallback(async () => {
    const ok = await requestLocationPermission();
    if (!ok) {
      Toast.show({ type: 'info', text1: 'Location permission denied' });
      return;
    }
    try {
      Geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const loc: LatLng = { latitude, longitude };
          setLocation(loc);
          const r: Region = { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
          setRegion(r);
          mapRef.current?.animateToRegion(r, 600);
        },
        (err) => {
          Toast.show({ type: 'error', text1: 'Location error', text2: err.message });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
      );
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Location error', text2: err?.message || String(err) });
    }
  }, [requestLocationPermission]);

  // Fetch location on mount
  useEffect(() => {
    goToMyLocation();
  }, [goToMyLocation]);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    const supervisorId = user?.supervisorId || user?.id || '';
    if (!supervisorId) {
      setLeads([]);
      setLoadingLeads(false);
      return;
    }
    setLoadingLeads(true);
    try {
      const res: any = await getMyLeads(supervisorId);
      const list: any[] = Array.isArray(res?.data) ? res.data : Array.isArray(res?.leads) ? res.leads : [];
      setLeads(list.map((x) => ({
        lead_id: String(x?.lead_id ?? ''),
        owner_name: x?.owner_name ?? x?.basic_details?.owner_name ?? '',
        stars: Number(x?.stars ?? 0),
        created_at: x?.created_at,
        points: Array.isArray(x?.points) ? x.points : [],
      })));
    } catch (e) {
      setLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ── Land-mapping handlers ─────────────────────────────────
  const handleMapPress = (e: MapPressEvent) => {
    if (!mappingMode) return;
    const coord = e.nativeEvent.coordinate;
    setPlotPoints((prev) => [...prev, coord]);
  };

  const undoLastPoint = () => {
    setPlotPoints((prev) => prev.slice(0, -1));
  };

  const cancelMapping = () => {
    setMappingMode(false);
    setPlotPoints([]);
  };

  const saveLandMapping = async () => {
    if (plotPoints.length < 3) {
      Toast.show({ type: 'error', text1: 'Need at least 3 points to create a plot' });
      return;
    }

    const supervisorId = user?.supervisorId || user?.id || '';
    if (!supervisorId) {
      Toast.show({ type: 'error', text1: 'No supervisor ID found' });
      return;
    }

    Alert.alert('Save Land Mapping', `Save this plot with ${plotPoints.length} points as a new lead?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Save',
        onPress: async () => {
          setSaving(true);
          try {
            await createLead({
              supervisor_id: supervisorId,
              points: plotPoints,
            });
            Toast.show({ type: 'success', text1: 'Lead Created', text2: 'Land mapping saved successfully' });
            setMappingMode(false);
            setPlotPoints([]);
          } catch (err: any) {
            Toast.show({ type: 'error', text1: 'Save Failed', text2: err?.message || 'Unknown error' });
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Full-screen Google Map */}
      <View style={styles.mapWrapTop}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          showsUserLocation
          showsMyLocationButton={false}
          mapType="satellite"
          accessibilityLabel="Main map showing location and plots"
          onPress={handleMapPress}
        >
          {/* Current-location marker */}
          {location && !mappingMode && <Marker coordinate={location} />}

          {/* Plot points & shape */}
          {plotPoints.length >= 3 && (
            <Polygon
              coordinates={plotPoints}
              strokeColor="#FDE047"
              strokeWidth={3}
              fillColor="rgba(253, 224, 71, 0.18)"
            />
          )}
          {plotPoints.length === 2 && (
            <Polyline coordinates={plotPoints} strokeColor="#FDE047" strokeWidth={3} />
          )}
          {plotPoints.map((p, idx) => (
            <Marker
              key={`plot-${idx}`}
              coordinate={p}
              pinColor="#FDE047"
            />
          ))}
        </MapView>
      </View>

      {/* Mapping-mode top banner */}
      {mappingMode && (
        <View style={styles.mappingBanner}>
          <Text style={styles.mappingBannerText}>
            Tap on the map to plot points ({plotPoints.length} placed)
          </Text>
        </View>
      )}

      {/* Bottom controls */}
      <View style={styles.bottomBar} pointerEvents="box-none">
        {!mappingMode ? (
          <>
            {/* My Location button */}
            <TouchableOpacity style={styles.circleBtn} onPress={goToMyLocation} activeOpacity={0.8}>
              <Icon name="crosshairs-gps" size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            {/* Make Land Mapping button */}
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => {
                setMappingMode(true);
                // ensure user sees where they are before plotting
                if (!location) {
                  goToMyLocation();
                } else {
                  const r: Region = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  };
                  setRegion(r);
                  mapRef.current?.animateToRegion(r, 400);
                }
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaText}>MAKE LAND MAPPING</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Cancel */}
            <TouchableOpacity style={[styles.circleBtn, styles.dangerBtn]} onPress={cancelMapping}>
              <Icon name="close" size={24} color={colors.surface} />
            </TouchableOpacity>

            {/* Undo */}
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={undoLastPoint}
              disabled={plotPoints.length === 0}
            >
              <Icon name="undo" size={24} color={plotPoints.length ? colors.textPrimary : colors.textDisabled} />
            </TouchableOpacity>

            {/* Save */}
            <TouchableOpacity
              style={[styles.ctaButton, plotPoints.length < 3 && styles.ctaDisabled]}
              onPress={saveLandMapping}
              disabled={saving || plotPoints.length < 3}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaText}>{saving ? 'SAVING...' : 'SAVE LEAD'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Today's Leads section */}
      <View style={styles.leadsSection}>
        <Text style={styles.sectionTitle}>Today's Leads</Text>

        <View style={styles.searchWrap}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search today's leads..."
            placeholderTextColor={colors.textDisabled}
            style={styles.searchInput}
          />
        </View>

        {loadingLeads ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={leads.filter((l) => {
              const q = search.trim().toLowerCase();
              if (!q) return true;
              return (String(l.owner_name || '').toLowerCase().includes(q) || String(l.lead_id || '').toLowerCase().includes(q));
            })}
            keyExtractor={(item) => item.lead_id}
            contentContainerStyle={{ padding: spacing.md }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.owner_name || `Land-${item.lead_id}`}</Text>
                    {item.created_at ? <Text style={styles.cardDate}>{new Date(item.created_at).toLocaleDateString()}</Text> : null}
                  </View>
                  <View style={styles.starsPill}>
                    <Text style={styles.starsText}>{'★'.repeat(Math.max(0, Math.min(5, Math.round(item.stars || 0))))}{'☆'.repeat(5 - Math.max(0, Math.min(5, Math.round(item.stars || 0))))}</Text>
                    <Text style={styles.starsCount}>{Math.max(0, Math.min(5, Math.round(item.stars || 0)))}/5</Text>
                  </View>
                  <TouchableOpacity style={styles.infoBtn} onPress={() => navigation.navigate('LeadsTab', { screen: 'LeadRecords' })}>
                    <Icon name="information" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrapTop: {
    height: 320,
    zIndex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mappingBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 12,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: borderRadius.medium,
    padding: spacing.sm,
    alignItems: 'center',
    zIndex: 30,
    elevation: 30,
  },
  mappingBannerText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 40,
    elevation: 40,
  },
  circleBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  dangerBtn: {
    backgroundColor: colors.error,
  },
  ctaButton: {
    flex: 1,
    height: 52,
    borderRadius: borderRadius.large,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  leadsSection: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
    marginTop: -20,
    paddingTop: 28,
    ...shadows.medium,
    zIndex: 5,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.medium,
    padding: spacing.sm,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    height: 40,
    ...typography.body,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDate: {
    ...typography.caption,
    color: colors.textDisabled,
  },
  starsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.small,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  starsText: {
    ...typography.body,
    color: colors.surface,
    marginRight: 4,
  },
  starsCount: {
    ...typography.body,
    color: colors.surface,
  },
  infoBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  centerWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});

export default DashboardScreen;
