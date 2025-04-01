import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Phone,
  Globe,
  Mail,
  Heart,
  HelpCircle,
  Link,
} from "lucide-react-native";

interface HelplineOrg {
  id: string;
  name: string;
  type: string;
  website: string;
  phone: string;
  email?: string;
  description: string;
}

export default function HelplineScreen() {
  const [helplines, setHelplines] = useState<HelplineOrg[]>([
    {
      id: "1",
      name: "NIMHANS",
      type: "Mental Health",
      website: "www.nimhans.ac.in",
      phone: "+91-80-26995002",
      email: "helpline@nimhans.in",
      description: "National Institute of Mental Health and Neurosciences",
    },
    {
      id: "2",
      name: "PeakMind",
      type: "Mental Wellness",
      website: "www.peakmind.in",
      phone: "+91-88888-11222",
      description: "Digital mental health platform",
    },
    {
      id: "3",
      name: "Sumaitri",
      type: "Crisis Support",
      website: "www.sumaitri.net",
      phone: "+91-11-23389090",
      description: "24/7 suicide prevention helpline",
    },
    {
      id: "4",
      name: "Mpower 1 on 1",
      type: "Counseling",
      website: "www.mpowerminds.com",
      phone: "+91-22-61506606",
      description: "Mental health support and counseling",
    },
    {
      id: "5",
      name: "Sneha",
      type: "Suicide Prevention",
      website: "www.snehanirmaan.org",
      phone: "+91-44-24640050",
      description: "Emotional support and suicide prevention",
    },
    {
      id: "6",
      name: "Kashmir Lifeline",
      type: "Regional Support",
      website: "www.kashmirlifeline.org",
      phone: "+91-194-2477001",
      description: "Mental health support in Kashmir region",
    },
    {
      id: "7",
      name: "Parivarthan Counselling",
      type: "Counseling",
      website: "www.parivarthan.org",
      phone: "+91-80-65669999",
      description: "Professional counseling services",
    },
    {
      id: "8",
      name: "Arpan",
      type: "Trauma Support",
      website: "www.arpan.org.in",
      phone: "+91-22-26633763",
      description: "Support for survivors of child sexual abuse",
    },
    {
      id: "9",
      name: "Vandrevala Foundation",
      type: "Mental Health",
      website: "www.vandrevalafoundation.com",
      phone: "+91-7700097100",
      description: "Comprehensive mental health support",
    },
  ]);

  const openLink = (url: string) => {
    Linking.openURL(`https://${url}`);
  };

  const makeCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Mental Health":
        return "#10B981";
      case "Crisis Support":
        return "#EF4444";
      case "Counseling":
        return "#3B82F6";
      case "Suicide Prevention":
        return "#6366F1";
      case "Regional Support":
        return "#EC4899";
      default:
        return "#6B7280";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Helpline Resources</Text>
        <Text style={styles.subtitle}>
          Support for Chronic Disease Patients
        </Text>
      </View>

      <ScrollView
        style={styles.helplineList}
        showsVerticalScrollIndicator={false}
      >
        {helplines.map((helpline) => (
          <View key={helpline.id} style={styles.helplineCard}>
            <View style={styles.helplineContent}>
              <View style={styles.helplineHeader}>
                <HelpCircle size={20} color={getTypeColor(helpline.type)} />
                <Text style={styles.helplineName}>{helpline.name}</Text>
              </View>

              <Text style={styles.helplineDescription}>
                {helpline.description}
              </Text>

              <View style={styles.helplineActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => makeCall(helpline.phone)}
                >
                  <Phone size={16} color="#6366F1" />
                  <Text style={styles.actionButtonText}>{helpline.phone}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openLink(helpline.website)}
                >
                  <Globe size={16} color="#10B981" />
                  <Text style={styles.actionButtonText}>
                    {helpline.website}
                  </Text>
                </TouchableOpacity>

                {helpline.email && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Linking.openURL(`mailto:${helpline.email}`)}
                  >
                    <Mail size={16} color="#EC4899" />
                    <Text style={styles.actionButtonText}>
                      {helpline.email}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 24,
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B7280",
  },
  helplineList: {
    flex: 1,
    padding: 16,
  },
  helplineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  helplineContent: {
    flex: 1,
  },
  helplineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  helplineName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#111827",
    marginLeft: 8,
  },
  helplineDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  helplineActions: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#111827",
    marginLeft: 8,
  },
});
