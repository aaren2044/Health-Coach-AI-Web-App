import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  User,
  HeartPulse,
  Ruler,
  Scale,
  Droplets,
  Activity,
  Pill,
  Utensils,
  Dumbbell,
  Target,
  Edit,
} from "lucide-react-native";

// User data from provided JSON
const DUMMY_USER_DATA = {
  name: "Tejas Salvi",
  age: 20,
  gender: "Male",
  height: 160,
  weight: 80,
  email: "10088.aids@gmail.com",
  phone: "12345678",
  conditions: ["Heart Disease"],
  medication: [
    {
      name: "HeartMed",
      dosage: "50",
      frequency: "2",
    },
  ],
  wearableDevice: "samsung",
  bloodSugar: null,
  heartRate: "60",
  bloodPressure: null,
  dietaryRestrictions: ["Halal"],
  exercisePreference: ["Running", "Cycling"],
  healthGoals: ["Weight Loss", "Stress Management"],
  id: "5c16d251-b0e3-4c4b-a7a4-59cb355423e0",
};

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "health" | "lifestyle"
  >("overview");
  const userData = DUMMY_USER_DATA;

  const ProfileField = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: any;
    icon?: React.ReactNode;
  }) => (
    <View style={styles.profileFieldContainer}>
      <View style={styles.profileFieldIcon}>{icon}</View>
      <View>
        <Text style={styles.profileFieldLabel}>{label}</Text>
        <Text style={styles.profileFieldValue}>{value || "Not provided"}</Text>
      </View>
    </View>
  );

  const renderChip = (items: string[], color: string) => (
    <View style={styles.chipContainer}>
      {items.map((item) => (
        <View key={item} style={[styles.chip, { backgroundColor: color }]}>
          <Text style={styles.chipText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  const renderMedication = () => {
    if (!userData.medication || userData.medication.length === 0) return null;

    return (
      <View style={styles.card}>
        <View style={[styles.cardHeader, { backgroundColor: "#FEF3C7" }]}>
          <Pill size={20} color="#D97706" />
          <Text style={styles.cardHeaderText}>Current Medications</Text>
        </View>
        <View style={styles.cardContent}>
          {userData.medication.map((med, index) => (
            <View key={index} style={styles.medicationItem}>
              <Text style={styles.medicationName}>{med.name}</Text>
              <View style={styles.medicationDetails}>
                <Text style={styles.medicationText}>Dosage: {med.dosage}</Text>
                <Text style={styles.medicationText}>
                  Frequency: {med.frequency} times
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>
              Welcome back, {userData.name}!
            </Text>
            <Text style={styles.subtitleText}>
              Here's your personalized health profile
            </Text>
          </View>
          {/* <TouchableOpacity style={styles.editButton}>
            <Edit size={16} color="#fff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.activeTab]}
          onPress={() => setActiveTab("overview")}
        >
          <User
            size={16}
            color={activeTab === "overview" ? "#3B82F6" : "#6B7280"}
          />
          <Text style={styles.tabText}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "health" && styles.activeTab]}
          onPress={() => setActiveTab("health")}
        >
          <HeartPulse
            size={16}
            color={activeTab === "health" ? "#3B82F6" : "#6B7280"}
          />
          <Text style={styles.tabText}>Health</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "lifestyle" && styles.activeTab]}
          onPress={() => setActiveTab("lifestyle")}
        >
          <Target
            size={16}
            color={activeTab === "lifestyle" ? "#3B82F6" : "#6B7280"}
          />
          <Text style={styles.tabText}>Lifestyle</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Cards */}
      <View style={styles.cardContainer}>
        {/* Personal Information Card */}
        <View style={styles.card}>
          <View style={[styles.cardHeader, { backgroundColor: "#BFDBFE" }]}>
            <User size={20} color="#1E40AF" />
            <Text style={styles.cardHeaderText}>Personal Information</Text>
          </View>
          <View style={styles.cardContent}>
            <ProfileField
              label="Email"
              value={userData.email}
              icon={<Text style={styles.iconText}>@</Text>}
            />
            <ProfileField
              label="Age"
              value={userData.age}
              icon={<Text style={styles.iconText}>🎂</Text>}
            />
            <ProfileField
              label="Gender"
              value={userData.gender}
              icon={<Text style={styles.iconText}>👤</Text>}
            />
            <ProfileField
              label="Phone"
              value={userData.phone}
              icon={<Text style={styles.iconText}>📱</Text>}
            />
            <ProfileField
              label="Wearable Device"
              value={userData.wearableDevice}
              icon={<Text style={styles.iconText}>⌚</Text>}
            />
          </View>
        </View>

        {/* Health Metrics Card */}
        {(activeTab === "overview" || activeTab === "health") && (
          <View style={styles.card}>
            <View style={[styles.cardHeader, { backgroundColor: "#FEE2E2" }]}>
              <HeartPulse size={20} color="#991B1B" />
              <Text style={styles.cardHeaderText}>Health Metrics</Text>
            </View>
            <View style={styles.cardContent}>
              <ProfileField
                label="Height"
                value={`${userData.height} cm`}
                icon={<Ruler size={16} color="#9CA3AF" />}
              />
              <ProfileField
                label="Weight"
                value={`${userData.weight} kg`}
                icon={<Scale size={16} color="#9CA3AF" />}
              />
              <ProfileField
                label="Heart Rate"
                value={`${userData.heartRate} bpm`}
                icon={<Activity size={16} color="#9CA3AF" />}
              />
              <ProfileField
                label="Blood Sugar"
                value={userData.bloodSugar || "Not measured"}
                icon={<Droplets size={16} color="#9CA3AF" />}
              />
              <ProfileField
                label="Blood Pressure"
                value={userData.bloodPressure || "Not measured"}
                icon={<Droplets size={16} color="#9CA3AF" />}
              />
            </View>
          </View>
        )}

        {/* Medication Card */}
        {activeTab === "health" && renderMedication()}

        {/* Health Conditions Card */}
        {activeTab === "health" && userData.conditions.length > 0 && (
          <View style={styles.card}>
            <View style={[styles.cardHeader, { backgroundColor: "#E9D5FF" }]}>
              <Pill size={20} color="#6D28D9" />
              <Text style={styles.cardHeaderText}>Health Conditions</Text>
            </View>
            <View style={styles.cardContent}>
              {renderChip(userData.conditions, "#E9D5FF")}
            </View>
          </View>
        )}

        {/* Lifestyle Card */}
        {(activeTab === "overview" || activeTab === "lifestyle") && (
          <View style={styles.card}>
            <View style={[styles.cardHeader, { backgroundColor: "#D1FAE5" }]}>
              <Target size={20} color="#047857" />
              <Text style={styles.cardHeaderText}>Lifestyle Preferences</Text>
            </View>
            <View style={styles.cardContent}>
              {userData.dietaryRestrictions.length > 0 && (
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionTitleContainer}>
                    <Utensils size={16} color="#6B7280" />
                    <Text style={styles.sectionTitle}>
                      Dietary Restrictions
                    </Text>
                  </View>
                  {renderChip(userData.dietaryRestrictions, "#D1FAE5")}
                </View>
              )}

              {userData.exercisePreference.length > 0 && (
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionTitleContainer}>
                    <Dumbbell size={16} color="#6B7280" />
                    <Text style={styles.sectionTitle}>
                      Exercise Preferences
                    </Text>
                  </View>
                  {renderChip(userData.exercisePreference, "#BFDBFE")}
                </View>
              )}

              {userData.healthGoals.length > 0 && (
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionTitleContainer}>
                    <Target size={16} color="#6B7280" />
                    <Text style={styles.sectionTitle}>Health Goals</Text>
                  </View>
                  {renderChip(userData.healthGoals, "#FEF3C7")}
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#3B82F6",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitleText: {
    color: "#BFDBFE",
    marginTop: 5,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    marginLeft: 5,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    margin: 15,
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 5,
  },
  activeTab: {
    backgroundColor: "white",
    borderRadius: 10,
  },
  tabText: {
    color: "#6B7280",
  },
  cardContainer: {
    paddingHorizontal: 15,
    gap: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardContent: {
    padding: 15,
    gap: 12,
  },
  profileFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileFieldIcon: {
    width: 25,
    alignItems: "center",
  },
  iconText: {
    fontSize: 16,
  },
  profileFieldLabel: {
    color: "#6B7280",
    fontSize: 14,
  },
  profileFieldValue: {
    color: "#111827",
    fontSize: 15,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
});

export default ProfileScreen;
