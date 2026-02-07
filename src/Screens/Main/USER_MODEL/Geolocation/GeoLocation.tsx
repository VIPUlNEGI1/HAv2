import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import MapView, { Marker, UrlTile } from 'react-native-maps';

interface Location {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export const GeoLocation = () => {
  const [location, setLocation] = useState<Location | null>(null); // <-- define type

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (pos: GeolocationResponse) => {
        const coords = pos.coords;
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          altitude: coords.altitude,
          accuracy: coords.accuracy,
          altitudeAccuracy: coords.altitudeAccuracy,
          heading: coords.heading,
          speed: coords.speed,
        });
      },
      err => console.log(err),
      { enableHighAccuracy: true, distanceFilter: 1 },
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  if (!location) {
    return (
      <View style={styles.center}>
        <Text>Fetching real location...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      region={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation={true}
      followsUserLocation={true}
    >
      <UrlTile
        urlTemplate="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=AIzaSyCcuSIshZR-axMKGKJzeetvhRzXGBqV2Y4
"
        maximumZ={19}
      />
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title="You are here"
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
