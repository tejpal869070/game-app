import { useEffect, useRef, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function HomeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const posters = [
    { id: "1", image: require("../assets/photos/poster1.jpg") },
    { id: "2", image: require("../assets/photos/poster1.jpg") },
    { id: "3", image: require("../assets/photos/poster1.jpg") },
    { id: "4", image: require("../assets/photos/poster1.jpg") },
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % posters.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [posters.length]);

  const renderPoster = ({ item }) => (
    <Image source={item.image} style={styles.posterImage} />
  );

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (styles.posterImage.width + 32)); // Account for width + margin
    setCurrentIndex(index);
  };
  return (
    <View style={styles.sliderContainer}>
      <FlatList
        ref={flatListRef}
        data={posters}
        renderItem={renderPoster}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
       
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    marginBottom: 16,
    overflow : "hidden",
  },
  posterImage: {
    width: 300,
    height: 150,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
