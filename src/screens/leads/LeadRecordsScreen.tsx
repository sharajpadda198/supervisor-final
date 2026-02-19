// Leads Screen — shows saved land-mapping leads
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAuth } from '../../context/AuthContext';
import { getMyLeads } from '../../utils/api';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';

type LatLng = { latitude: number; longitude: number };

type LeadRecord = {
  lead_id: string;
  stars: number;
  owner_name?: string;
  created_at?: string;
  points: LatLng[];
};

const clampStars = (n: number) => Math.max(0, Math.min(5, Math.round(n)));
const renderStars = (s: number) => '★'.repeat(clampStars(s)) + '☆'.repeat(5 - clampStars(s));

const LeadRecordsScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState<LeadRecord[]>([]);
  const [search, setSearch] = useState('');
  const [mapLead, setMapLead] = useState<LeadRecord | null>(null);

  const supervisorId = useMemo(() => {
    const s = user?.supervisorId;
    if (typeof s === 'string' && s.trim()) return s.trim();
    const id = user?.id;
    if (typeof id === 'string' && id.trim()) return id.trim();
    return '';
  }, [user]);

  const fetchLeads = useCallback(async () => {
    if (!supervisorId) {
      setRecords([]);
      setLoading(false);
      return;
    }
    try {
      const res: any = await getMyLeads(supervisorId);
      const list: any[] = Array.isArray(res?.data) ? res.data : Array.isArray(res?.leads) ? res.leads : [];
      const parsed: LeadRecord[] = list
        .map((x: any) => ({
          lead_id: String(x?.lead_id ?? ''),
          stars: Number(x?.stars ?? 0),
          owner_name: x?.owner_name ?? x?.basic_details?.owner_name ?? '',
          created_at: x?.created_at,
          points: Array.isArray(x?.points) ? x.points : [],
        }))
        .filter((x) => x.lead_id);
      setRecords(parsed);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [supervisorId]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLeads();
    setRefreshing(false);
  }, [fetchLeads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) => {
      const name = (r.owner_name ?? '').toLowerCase();
      const id = (r.lead_id ?? '').toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [records, search]);

  // Map region for selected lead
  const mapRegion = useMemo(() => {
    if (!mapLead?.points?.length) return undefined;
    const lats = mapLead.points.map((p) => p.latitude);
    const lngs = mapLead.points.map((p) => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(maxLat - minLat, 0.005) * 1.5,
      longitudeDelta: Math.max(maxLng - minLng, 0.005) * 1.5,
    };
  }, [mapLead]);

  const renderItem = ({ item }: { item: LeadRecord }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => setMapLead(item)}
    >
      <View style={styles.cardRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.owner_name || `Land-${item.lead_id}`}
          </Text>
          {item.created_at ? (
            <Text style={styles.cardDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
          ) : null}
        </View>
        <View style={styles.starsPill}>
          <Text style={styles.starsText}>{renderStars(item.stars)}</Text>
          <Text style={styles.starsCount}>{clampStars(item.stars)}/5</Text>
        </View>
        <TouchableOpacity style={styles.infoBtn} onPress={() => setMapLead(item)}>
          <Icon name="map-marker-radius" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Leads</Text>
      </View>

      <View style={styles.searchWrap}>
        <Icon name="magnify" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search leads..."
          placeholderTextColor={colors.textDisabled}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading leads...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centerWrap}>
          <Icon name="file-document-outline" size={48} color={colors.textDisabled} />
          <Text style={styles.emptyText}>No leads found.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.lead_id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: spacing.md }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        />
      )}

      {/* Map Modal for a lead */}
      <Modal visible={!!mapLead} transparent animationType="fade" onRequestClose={() => setMapLead(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.mapModalCard}>
            <Text style={styles.modalTitle}>
              {mapLead?.owner_name || `Land-${mapLead?.lead_id}`}
            </Text>

            <View style={styles.mapWrap}>
              {mapRegion && (
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.mapFull}
                  initialRegion={mapRegion}
                  showsCompass
                  rotateEnabled
                  zoomControlEnabled
                  loadingEnabled
                >
                  {(mapLead?.points?.length ?? 0) >= 3 && (
                    <Polygon
                      coordinates={mapLead!.points}
                      strokeColor="#FDE047"
                      strokeWidth={3}
                      fillColor="rgba(253, 224, 71, 0.18)"
                    />
                  )}
                  {(mapLead?.points?.length ?? 0) === 2 && (
                    <Polyline coordinates={mapLead!.points} strokeColor="#FDE047" strokeWidth={3} />
                  )}
                  {mapLead?.points?.map((p, idx) => (
                    <Marker key={`m-${idx}`} coordinate={p} />
                  ))}
                </MapView>
              )}
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setMapLead(null)}>
              <Text style={styles.closeButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.surface,
    fontWeight: 'bold',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.textPrimary,
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textDisabled,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  cardDate: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  starsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(253, 224, 71, 0.25)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: spacing.sm,
  },
  starsText: { color: '#B45309', fontSize: 12 },
  starsCount: { color: '#B45309', fontWeight: '700', fontSize: 12, marginLeft: 4 },
  infoBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  mapModalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    padding: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  mapWrap: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  mapFull: { width: '100%', height: '100%' },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '700',
  },
});

export default LeadRecordsScreen;
