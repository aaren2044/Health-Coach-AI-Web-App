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
          {/* Tasks Button */}
          <Link href="/task" asChild>
            <TouchableOpacity style={styles.navigationButton}>
              <View style={styles.iconContainer}>
                <Icon name="tasks" size={24} color="#4A90E2" />{" "}
                {/* Changed from heartbeat to tasks */}
              </View>
              <Text style={styles.navigationButtonText}>Task</Text>
            </TouchableOpacity>
          </Link>

          {/* Diet planner Button */}
          <Link href="/Diet" asChild>
            <TouchableOpacity style={styles.navigationButton}>
              <View style={styles.iconContainer}>
                <Icon name="utensils" size={24} color="#4A90E2" />{" "}
                {/* Changed from comment-medical to utensils */}
              </View>
              <Text style={styles.navigationButtonText}>Diet Planner</Text>
            </TouchableOpacity>
          </Link>

          {/* Helpline Button */}
          <Link href="/helpline" asChild>
            <TouchableOpacity style={styles.navigationButton}>
              <View style={styles.iconContainer}>
                <Icon name="phone-alt" size={24} color="#4A90E2" />{" "}
                {/* Changed from book-medical to phone-alt */}
              </View>
              <Text style={styles.navigationButtonText}>Helpline</Text>{" "}
              {/* Changed text to match icon */}
            </TouchableOpacity>
          </Link>

          {/* Community Button */}
          <Link href="/community" asChild>
            <TouchableOpacity style={styles.navigationButton}>
              <View style={styles.iconContainer}>
                <Icon name="users" size={24} color="#4A90E2" />{" "}
                {/* Changed from user-alt to users */}
              </View>
              <Text style={styles.navigationButtonText}>Community</Text>{" "}
              {/* Changed text to match icon */}
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
