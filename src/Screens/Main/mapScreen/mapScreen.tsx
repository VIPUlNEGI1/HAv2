import { View, StyleSheet, Image, Text, Pressable, ScrollView, Dimensions, Linking, Platform } from 'react-native';
import React, { useState, useMemo } from 'react';

import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { useMap } from './hook/usemap';
import { useTheme } from '@/Theme/useTheme';
import { HospitalDetailModal } from './components/HospitalDetailModal';
import { Navigation, Map as MapIcon, FlaskConical, User, X, LocateFixed, Footprints, Car } from 'lucide-react-native';
import Animated, { FadeInDown, SlideInDown, SlideOutDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function MapScreen() {
  const { theme, shadows } = useTheme();
  const {
    mapRef,
    region,
    setMapReady,
    requestLocationPermission,
    onRegionChangeComplete,
    nearbyPlaces,
    calculateDistance,
  } = useMap();

  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [trackingMode, setTrackingMode] = useState(false);
  const [travelMode, setTravelMode] = useState<'walking' | 'driving'>('driving');

  const filters = ['All', 'Hospital', 'Lab', 'Therapist'];

  const filteredPlaces = nearbyPlaces.filter(place => 
    activeFilter === 'All' || place.type === activeFilter
  );

  const handleMarkerPress = (place: any) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const openExternalMap = (place: any) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${place.latitude},${place.longitude}`;
    const label = place.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          const browserUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;
          Linking.openURL(browserUrl);
        }
      });
    }
  };

  const startTracking = (place: any) => {
    setModalVisible(false);
    setTrackingMode(true);
    
    mapRef.current?.animateToRegion({
      latitude: (region.latitude + place.latitude) / 2,
      longitude: (region.longitude + place.longitude) / 2,
      latitudeDelta: Math.abs(region.latitude - place.latitude) * 2,
      longitudeDelta: Math.abs(region.longitude - place.longitude) * 2,
    }, 1000);
  };

  const currentDistance = useMemo(() => {
    if (!selectedPlace) return '0';
    return calculateDistance(region.latitude, region.longitude, selectedPlace.latitude, selectedPlace.longitude);
  }, [region, selectedPlace, calculateDistance]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        showsUserLocation={false} 
        // @ts-ignore
        onUserLocationChange={null} 
        onMapReady={() => {
          setMapReady(true);
          requestLocationPermission();
        }}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {/* Nearby Places Markers */}
        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            onPress={() => handleMarkerPress(place)}
            tracksViewChanges={true}
          >
            <View style={styles.markerWrapper}>
              <View style={[styles.markerImageContainer, { borderColor: theme.primary }]}>
                <Image source={{ uri: place.image }} style={styles.markerImage} />
              </View>
              <View style={[styles.markerPointer, { borderTopColor: theme.primary }]} />
            </View>
            <Callout tooltip>
              <View style={[styles.callout, { backgroundColor: theme.surface, ...shadows }]}>
                <Text style={[styles.calloutTitle, { color: theme.text }]}>{place.name}</Text>
                <Text style={[styles.calloutSub, { color: theme.textSecondary }]}>{place.type}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* User Location Marker */}
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
          <View style={styles.userMarkerWrapper}>
            <View style={[styles.userMarkerPulse, { backgroundColor: theme.secondary }]} />
            <View style={[styles.userMarkerInner, { backgroundColor: theme.secondary }]} />
          </View>
        </Marker>

        {/* Route Line (Tracking Mode) */}
        {trackingMode && selectedPlace && (
          <Polyline
            coordinates={[
              { latitude: region.latitude, longitude: region.longitude },
              { latitude: selectedPlace.latitude, longitude: selectedPlace.longitude }
            ]}
            strokeColor={theme.primary}
            strokeWidth={4}
            lineDashPattern={travelMode === 'walking' ? [2, 5] : [0]}
          />
        )}
      </MapView>

      {/* Top Filters (Hide in tracking mode) */}
      {!trackingMode && (
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {filters.map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterBtn,
                  { 
                    backgroundColor: activeFilter === filter ? theme.primary : theme.surface,
                    borderColor: activeFilter === filter ? theme.primary : theme.border 
                  },
                  shadows
                ]}
              >
                <Text style={[
                  styles.filterText,
                  { color: activeFilter === filter ? '#fff' : theme.textSecondary }
                ]}>
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Tracking Info Panel */}
      {trackingMode && selectedPlace && (
        <Animated.View 
          entering={SlideInDown} 
          exiting={SlideOutDown}
          style={[styles.trackingPanel, { backgroundColor: theme.surface, ...shadows }]}
        >
          <View style={styles.trackingHeader}>
            <View style={styles.trackingInfo}>
              <Text style={[styles.trackingTitle, { color: theme.textSecondary }]}>TRACKING TO</Text>
              <Text style={[styles.trackingPlaceName, { color: theme.text }]}>{selectedPlace.name}</Text>
            </View>
            <Pressable 
              onPress={() => setTrackingMode(false)}
              style={[styles.closeTracking, { backgroundColor: theme.background }]}
            >
              <X size={20} color={theme.text} />
            </Pressable>
          </View>
          
          <View style={styles.modeToggleRow}>
            <Pressable 
              onPress={() => setTravelMode('driving')}
              style={[styles.modeBtn, travelMode === 'driving' && { backgroundColor: theme.accent }]}
            >
              <Car size={20} color={travelMode === 'driving' ? theme.primary : theme.textSecondary} />
              <Text style={[styles.modeText, { color: travelMode === 'driving' ? theme.primary : theme.textSecondary }]}>Driving</Text>
            </Pressable>
            <Pressable 
              onPress={() => setTravelMode('walking')}
              style={[styles.modeBtn, travelMode === 'walking' && { backgroundColor: theme.accent }]}
            >
              <Footprints size={20} color={travelMode === 'walking' ? theme.primary : theme.textSecondary} />
              <Text style={[styles.modeText, { color: travelMode === 'walking' ? theme.primary : theme.textSecondary }]}>Walking</Text>
            </Pressable>
          </View>

          <View style={[styles.distanceBadge, { backgroundColor: theme.accent }]}>
            <LocateFixed size={24} color={theme.primary} />
            <View>
              <Text style={[styles.distanceValue, { color: theme.primary }]}>{currentDistance} km</Text>
              <Text style={[styles.distanceLabel, { color: theme.primary }]}>
                {travelMode === 'walking' ? 'Walking Distance' : 'Driving Distance'}
              </Text>
            </View>
          </View>

          <View style={styles.trackingActions}>
            <Pressable 
              onPress={() => openExternalMap(selectedPlace)}
              style={[styles.googleMapsBtn, { backgroundColor: theme.primary }]}
            >
              <Navigation size={20} color="#fff" fill="#fff" />
              <Text style={styles.googleMapsText}>Start Navigation</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* Default Floating Card */}
      {!modalVisible && !trackingMode && (
        <View style={[styles.floatingCard, { backgroundColor: theme.surface, ...shadows }]}>
          <View style={styles.cardHeader}>
            <MapIcon size={20} color={theme.primary} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Nearby Medical Facilities</Text>
          </View>
          <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
            Found {filteredPlaces.length} facilities near your location
          </Text>
        </View>
      )}

      <HospitalDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onTrackPress={startTracking}
        place={selectedPlace}
        distance={currentDistance}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  markerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  markerPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  callout: {
    padding: 12,
    borderRadius: 16,
    minWidth: 150,
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  calloutSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  userMarkerWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarkerPulse: {
    width: 30,
    height: 30,
    borderRadius: 15,
    opacity: 0.3,
    position: 'absolute',
  },
  userMarkerInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 5,
  },
  filterContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  floatingCard: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 24,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardSub: {
    fontSize: 13,
    fontWeight: '600',
  },
  trackingPanel: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    padding: 24,
    borderRadius: 32,
    elevation: 20,
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  trackingInfo: {
    flex: 1,
  },
  trackingTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  trackingPlaceName: {
    fontSize: 20,
    fontWeight: '900',
  },
  closeTracking: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeToggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
  },
  distanceValue: {
    fontSize: 26,
    fontWeight: '900',
  },
  distanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  trackingActions: {
    width: '100%',
  },
  googleMapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 18,
    elevation: 5,
  },
  googleMapsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
});
