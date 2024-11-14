import { ResizeMode, Video } from "expo-av";
import { StyleSheet, View, Dimensions } from "react-native";

export default function CarSceneNative() {
  return (
    <View style={styles.container}>
      <Video
        source={{
          uri: "https://res.cloudinary.com/dathl84tp/video/upload/v1731238959/videos/Autospace_-_Brave_2024-11-10_17-20-53_hp3yqn.mp4",
        }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={true}
        isMuted={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // Hoặc có thể dùng
    // ...StyleSheet.absoluteFillObject,
  },
});
