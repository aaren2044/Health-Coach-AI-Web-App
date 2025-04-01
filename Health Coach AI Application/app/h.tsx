import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const { width } = Dimensions.get("window");

const UserHealthMonitoring = () => {
  // Static health data
  const healthData = {
    heartRate: 85,
    systolicBP: 120,
    diastolicBP: 80,
    bloodOxygen: 98,
    bodyTemperature: 36.7,
    steps: 3456,
  };

  const HealthMetricCard = ({ icon, name, value, unit }) => (
    <View style={styles.metricCard}>
      <Icon name={icon} size={40} color="#4A90E2" />
      <Text style={styles.metricName}>{name}</Text>
      <Text style={styles.metricValue}>
        {value} {unit}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Hey Aaren! Welcome to Health Monitor
          </Text>
        </View>
        <View style={styles.metricsContainer}>
          <View style={styles.metricRow}>
            <HealthMetricCard
              icon="heartbeat"
              name="Heart Rate"
              value={healthData.heartRate}
              unit="BPM"
            />
            <HealthMetricCard
              icon="chart-line"
              name="Systolic BP"
              value={healthData.systolicBP}
              unit="mm Hg"
            />
          </View>
          <View style={styles.metricRow}>
            <HealthMetricCard
              icon="chart-area"
              name="Diastolic BP"
              value={healthData.diastolicBP}
              unit="mm Hg"
            />
            <HealthMetricCard
              icon="tint"
              name="Blood Oxygen"
              value={healthData.bloodOxygen}
              unit="%"
            />
          </View>
          <View style={styles.metricRow}>
            <HealthMetricCard
              icon="thermometer-half"
              name="Temperature"
              value={healthData.bodyTemperature}
              unit="°C"
            />
            <HealthMetricCard
              icon="walking"
              name="Steps"
              value={healthData.steps}
              unit=""
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  header: {
    padding: 15,
    backgroundColor: "#4A90E2",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  metricsContainer: {
    padding: 10,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  metricCard: {
    width: width / 2.3,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricName: {
    marginTop: 10,
    color: "#2C3E50",
    fontWeight: "600",
  },
  metricValue: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495E",
  },
});

export default UserHealthMonitoring;
