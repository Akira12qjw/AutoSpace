import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Text, TextInput, View } from "react-native";
// const accessToken = `${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
// Mapbox.setAccessToken(accessToken);
export default function Map() {
  return (
    <View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm địa điểm..."
          placeholderTextColor="#666"
        />
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 10.762622, // Ví dụ tọa độ (TP.HCM)
          longitude: 106.660172,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Thêm marker nếu cần */}
        <Marker
          coordinate={{
            latitude: 10.762622,
            longitude: 106.660172,
          }}
          title="Vị trí của tôi"
          description="Mô tả vị trí"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    top: "6%",
    left: 10,
    right: 10,
    zIndex: 1,
    elevation: 3, // Cho Android
  },
  searchInput: {
    height: 45,
    backgroundColor: "white",
    borderRadius: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Cho Android
  },
});
