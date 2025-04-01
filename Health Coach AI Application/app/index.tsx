import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

export default function LandingPage() {
  const features = [
    {
      icon: "📅✨",
      title: "Smart Scheduling",
      description: "Never miss a dose! AI-powered medication reminders ⏰💊",
    },
    {
      icon: "🍽️🌟",
      title: "Dietary Guidance",
      description: "Personalized meal plans 🥗🍎 that love your body back!",
    },
    {
      icon: "💪🔥",
      title: "Exercise Routines",
      description: "Workouts that adapt as you progress 🏋️‍♀️📈",
    },
    {
      icon: "❤️📊",
      title: "Health Monitoring",
      description: "Track vitals in real-time 🩺→📲",
    },
    {
      icon: "🤖💡",
      title: "AI Health Coach",
      description: "24/7 guidance from your pocket assistant 📱❤️",
    },
    {
      icon: "🔔⚠️",
      title: "Smart Alerts",
      description: "Early warnings for potential risks 🚨→🛡️",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>🤖 Your AI Health Companion 🩺</Text>
          <Text style={styles.heroSubtitle}>
            🌟 Transform your health journey with personalized AI guidance! Get
            real-time support for chronic conditions and wellness goals. Your
            healthier future starts now! 🚀
          </Text>
          <View style={styles.buttonContainer}>
            <Link href="/UserLeft" asChild>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.buttonText}>
                  🚀 Start My Health Journey
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href="https://t.me/MedGuardianDietBot" asChild>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>
                  💬 Chat on Telegram
                </Text>
              </TouchableOpacity>
            </Link>
            <Link href="/UserScreen" asChild>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.buttonText}>👩‍⚕️ Meet Your AI Doctor</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <View style={styles.featuresTitleContainer}>
          <Text style={styles.featuresTitle}>
            🌈 Your All-in-One Health Hub
          </Text>
          <Text style={styles.featuresSubtitle}>
            Everything you need to thrive, all in one magical app ✨
          </Text>
        </View>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>✨ {feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonial Section */}
      <View style={styles.testimonialSection}>
        <Text style={styles.testimonialTitle}>🚀 Made by Team Send Nodes</Text>
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>
            Engineering is 90% fixing mistakes. Drinking is 90% making them.
          </Text>
          <Text style={styles.testimonialAuthor}>- Team Send Nodes</Text>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>
          Ready for Your Health Transformation?
        </Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of happy users taking control of their health today! 🌟
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  heroSection: {
    backgroundColor: "#F0F4F8",
    paddingTop: 60,
    paddingBottom: 80,
    alignItems: "center",
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#2575FC",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 25,
    maxWidth: 300,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    flexWrap: "wrap",
  },
  primaryButton: {
    backgroundColor: "#2575FC",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    minWidth: 180,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#2575FC",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    minWidth: 180,
  },
  secondaryButtonText: {
    color: "#2575FC",
    fontWeight: "600",
    fontSize: 14,
  },
  featuresSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  featuresTitleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2E86AB",
  },
  featuresSubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    fontStyle: "italic",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  featureCard: {
    width: width * 0.4,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: "#2575FC",
  },
  featureDescription: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    lineHeight: 18,
  },
  testimonialSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#F8F9FA",
  },
  testimonialTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#E91E63",
  },
  testimonialCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testimonialText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#555555",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 24,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E91E63",
    textAlign: "right",
  },
  ctaSection: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#2575FC",
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "#E3F2FD",
    textAlign: "center",
    marginBottom: 20,
    maxWidth: 300,
  },
  ctaButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  ctaButtonText: {
    color: "#2575FC",
    fontWeight: "bold",
    fontSize: 16,
  },
});
