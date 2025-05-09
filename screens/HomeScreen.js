import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import OurGames from "./Games/OurGames";
import Crickets from "./Games/Crickets";
import HomeSlider from "../Componentes/HomeSlider";

export default function HomeScreen({ navigation }) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const tabFlatListRef = useRef(null);

  const tabs = [
    { id: "1", title: "Game", content: OurGames },
    { id: "2", title: "Match", content: Crickets }, 
    { id: "3", title: "Options", content: renderFootballTab },
  ];

  function renderFootballTab() {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabContentText}>Football updates coming soon!</Text>
      </View>   
    ); 
  }

  const renderTabContent = ({ item }) => ( 
    <View style={styles.tabContentContainer}>{item.content()}</View>
  );
       
  
  const handleTabScroll = (event) => {  
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / Dimensions.get("window").width);
    setCurrentTabIndex(index);
  };  

  const handleTabPress = (index) => {
    setCurrentTabIndex(index); 
    tabFlatListRef.current?.scrollToIndex({ index, animated: true });
  };

  return ( 
    <ScrollView style={styles.container}>  
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/photos/boy.png")}
          style={styles.headerProfileImage}
        />
        <Image
          source={require("../assets/photos/logo.png")}
          style={styles.headerLogoImage}
        />
        <TouchableOpacity>
          <Ionicons name="notifications" size={28} color="#1E293B" />
        </TouchableOpacity>
      </View> 

      {/* Balance Section */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Your Balance</Text>
        <Text style={styles.balanceAmount}>$5,230.00</Text>
      </View>

      <HomeSlider />

      {/* Swipe Tabs Section */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabHeader}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabHeaderItem,
                currentTabIndex === index && styles.tabHeaderItemActive,
              ]}
              onPress={() => handleTabPress(index)}
            >
              <Text
                style={[
                  styles.tabHeaderText,
                  currentTabIndex === index && styles.tabHeaderTextActive,
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          ref={tabFlatListRef}
          data={tabs}
          renderItem={renderTabContent}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleTabScroll}
          scrollEventThrottle={16}
        />
      </View>
 
      <StatusBar style="dark" />
    </ScrollView>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingTop: 40,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  // Greeting Section
  greetingContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4, 
  },
  subGreetingText: {
    fontSize: 16,
    color: "#6B7280", 
  },
  // Balance Section 
  balanceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
  }, 
  balanceAmount: {
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#1E293B",
    marginBottom: 16,
  },
  transferButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 9999,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  transferText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  transferIcon: {
    marginLeft: 4,
  },
  // Recent Transactions Section
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 16,
  },

  // Quick Actions Section
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "22%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    color: "#1E293B",
    marginTop: 8,
  },

  headerLogoImage: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  tabsContainer: {
    marginBottom: 16,
  }, 
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 4,
    backgroundColor: "#fff",
    borderRadius: 12, 
    marginHorizontal: 16,
    marginBottom: 8, 
    boxShadow : "1px 1px 4px black"
  },
  tabHeaderItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabHeaderItemActive: {
    backgroundColor: "#2563EB",
    borderRadius: 90,  
    paddingHorizontal: 24,
  },
  tabHeaderText: { 
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "bold",
  },
  tabHeaderTextActive: {
    color: "#fff",
  },
  tabContentContainer: {
    width: Dimensions.get("window").width,
    paddingHorizontal: 16,
  },
  tabContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabContentText: {
    fontSize: 16,
    color: "#1E293B",
    textAlign: "center",
  },
});
 