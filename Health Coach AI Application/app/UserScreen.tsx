import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";

const { width } = Dimensions.get("window");

const UserHealthMonitoring = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Navigation Buttons with Enhanced Styling */}
        <View style={styles.navigationContainer}>
          {/* Health Metrics Button */}
          <Link href="/h" asChild>
            <TouchableOpacity style={styles.navigationButton}>
              <View style={styles.iconContainer}>
                <Icon name="heartbeat" size={24} color="#4A90E2" />
              </View>
              <Text style={styles.navigationButtonText}>Health Metrics</Text>
            </TouchableOpacity>
          </Link>

          {/* Chatbot Button */}
          <Link href="/chat" asChild>
            <TouchableOpacity style={styles.navigationButton}>
              <View style={styles.iconContainer}>
                <Icon name="comment-medical" size={24} color="#4A90E2" />
              </View>
              <Text style={styles.navigationButtonText}>AI Chatbot</Text>
            </TouchableOpacity>
          </Link>

          {/* Articles Button */}
          <Link href="/Aricles" asChild>
            <TouchableOpacity style={styles.navigationButton}>
              <View style={styles.iconContainer}>
                <Icon name="book-medical" size={24} color="#4A90E2" />
              </View>
              <Text style={styles.navigationButtonText}>Health Articles</Text>
            </TouchableOpacity>
          </Link>

          {/* Profile Button */}
          <Link href="/profile" asChild>
            <TouchableOpacity style={styles.navigationButton}>
              <View style={styles.iconContainer}>
                <Icon name="user-alt" size={24} color="#4A90E2" />
              </View>
              <Text style={styles.navigationButtonText}>My Profile</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  navigationContainer: {
    flexDirection: "column",
    gap: 20,
  },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: "#E6F2FF",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  navigationButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    flex: 1,
  },
});

export default UserHealthMonitoring;
