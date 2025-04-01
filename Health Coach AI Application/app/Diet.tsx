import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Heart,
  Target,
  Utensils,
  PlusCircle,
  Trash2,
} from "lucide-react-native";

const GEMINI_API_KEY = "AIzaSyA1CDOiGtUbzihK8gj-8ud8SRkeQYovrEw";
type DietPlan = {
  id: string;
  name: string;
  description: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  created_at: string;
  additional_advice?: string;
};

type UserData = {
  dietaryRestrictions: string[];
  exercisePreference: string[];
  healthGoals: string[];
  conditions: string[];
  age: number | null;
  gender: string | null;
  weight: number | null;
  height: number | null;
};

const DietRecommendations: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    dietaryRestrictions: ["Vegetarian", "Low Carb"],
    exercisePreference: ["Yoga", "Walking"],
    healthGoals: ["Weight Loss", "Improve Energy"],
    conditions: [],
    age: 35,
    gender: "Female",
    weight: 65,
    height: 170,
  });

  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [newPlanName, setNewPlanName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateDietPlan = async () => {
    if (!GEMINI_API_KEY) {
      Alert.alert("❌ Error", "Gemini API key is not configured");
      return;
    }

    setGenerating(true);

    const prompt = `Create a detailed personalized diet plan based on the following information:
    
    User Profile:
    - Age: ${userData.age || "Not specified"}
    - Gender: ${userData.gender || "Not specified"}
    - Weight: ${userData.weight || "Not specified"} kg
    - Height: ${userData.height || "Not specified"} cm
    
    Health Factors:
    - Conditions: ${userData.conditions.join(", ") || "None"}
    - Dietary Restrictions: ${userData.dietaryRestrictions.join(", ") || "None"}
    - Exercise Preferences: ${userData.exercisePreference.join(", ") || "None"}
    - Health Goals: ${userData.healthGoals.join(", ") || "None"}
    
    Please provide:
    1. A name for this diet plan
    2. A brief description of its benefits
    3. Specific meal suggestions for breakfast, lunch, dinner, and snacks
    4. Any additional nutritional advice
    
    Format the response as a JSON object with these properties:
    {
      "name": "Plan Name",
      "description": "Plan description",
      "meals": {
        "breakfast": "...",
        "lunch": "...",
        "dinner": "...",
        "snacks": "..."
      },
      "additional_advice": "..."
    }

    Return ONLY the JSON object without any additional text or markdown formatting.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              topP: 1,
              topK: 40,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to generate diet plan"
        );
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      let cleanedResponse = textResponse;
      if (cleanedResponse.includes("json")) {
        cleanedResponse = cleanedResponse
          .replace(/json/g, "")
          .replace(/```/g, "");
      }
      cleanedResponse = cleanedResponse.trim();

      const planData = JSON.parse(cleanedResponse);

      const newPlan: DietPlan = {
        id: `${dietPlans.length + 1}`,
        name: planData.name,
        description: planData.description,
        meals: planData.meals,
        additional_advice: planData.additional_advice,
        created_at: new Date().toISOString(),
      };

      setDietPlans([newPlan, ...dietPlans]);
      setSelectedPlan(newPlan);
      setGenerating(false);
      Alert.alert("✅ Success", "Diet plan generated successfully!");
    } catch (error) {
      console.error("Error generating diet plan:", error);
      setGenerating(false);
      Alert.alert(
        "❌ Error",
        error instanceof Error ? error.message : "Failed to generate diet plan"
      );
    }
  };

  const saveCustomPlan = () => {
    if (!newPlanName) return;

    const newPlan: DietPlan = {
      id: `${dietPlans.length + 1}`,
      name: newPlanName,
      description: "Custom diet plan",
      meals: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snacks: "",
      },
      created_at: new Date().toISOString(),
    };

    setDietPlans([newPlan, ...dietPlans]);
    setSelectedPlan(newPlan);
    setShowForm(false);
    setNewPlanName("");
    Alert.alert("✅ Success", "Custom diet plan created!");
  };

  const deletePlan = (id: string) => {
    Alert.alert(
      "🗑️ Delete Plan",
      "Are you sure you want to delete this diet plan?",
      [
        { text: "❌ Cancel", style: "cancel" },
        {
          text: "✅ Delete",
          style: "destructive",
          onPress: () => {
            setDietPlans(dietPlans.filter((plan) => plan.id !== id));
            if (selectedPlan?.id === id) setSelectedPlan(null);
          },
        },
      ]
    );
  };

  const renderUserProfile = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>🌿 Your Health Profile</Text>

      <View style={styles.profileSection}>
        <Text style={styles.profileLabel}>🥗 Dietary Restrictions</Text>
        <View style={styles.chipContainer}>
          {userData.dietaryRestrictions.map((item, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.profileLabel}>🏋️ Exercise Preferences</Text>
        <View style={styles.chipContainer}>
          {userData.exercisePreference.map((item, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={generateDietPlan}
          disabled={generating}
        >
          {generating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Utensils color="white" size={20} />
          )}
          <Text style={styles.primaryButtonText}>
            {generating ? "⚡ Generating..." : "🍽️ Generate New Diet Plan"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowForm(!showForm)}
        >
          <PlusCircle color="black" size={20} />
          <Text style={styles.secondaryButtonText}>✨ Create Custom Plan</Text>
        </TouchableOpacity>

        {showForm && (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              value={newPlanName}
              onChangeText={setNewPlanName}
              placeholder="📝 Enter custom plan name"
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveCustomPlan}
            >
              <Text style={styles.saveButtonText}>💾 Save Custom Plan</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderDietPlans = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>📋 Your Diet Plans</Text>

      {dietPlans.map((plan) => (
        <TouchableOpacity
          key={plan.id}
          style={[
            styles.planCard,
            selectedPlan?.id === plan.id && styles.selectedPlanCard,
          ]}
          onPress={() => setSelectedPlan(plan)}
        >
          <View style={styles.planCardHeader}>
            <Text style={styles.planTitle}>📌 {plan.name}</Text>
            <TouchableOpacity onPress={() => deletePlan(plan.id)}>
              <Trash2 color="red" size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.planDescription} numberOfLines={2}>
            {plan.description}
          </Text>
          <Text style={styles.planDate}>
            🗓️ {new Date(plan.created_at).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSelectedPlanDetails = () =>
    selectedPlan && (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>📋 {selectedPlan.name}</Text>
        <Text style={styles.planDescription}>{selectedPlan.description}</Text>

        <View style={styles.mealSection}>
          <Text style={styles.mealTitle}>🌅 Breakfast</Text>
          <Text style={styles.mealText}>{selectedPlan.meals.breakfast}</Text>
        </View>

        <View style={styles.mealSection}>
          <Text style={styles.mealTitle}>🏙️ Lunch</Text>
          <Text style={styles.mealText}>{selectedPlan.meals.lunch}</Text>
        </View>

        <View style={styles.mealSection}>
          <Text style={styles.mealTitle}>🌃 Dinner</Text>
          <Text style={styles.mealText}>{selectedPlan.meals.dinner}</Text>
        </View>

        <View style={styles.mealSection}>
          <Text style={styles.mealTitle}>🍎 Snacks</Text>
          <Text style={styles.mealText}>{selectedPlan.meals.snacks}</Text>
        </View>

        {selectedPlan.additional_advice && (
          <View style={styles.adviceSection}>
            <Text style={styles.adviceTitle}>
              💡 Additional Nutritional Advice
            </Text>
            <Text style={styles.adviceText}>
              {selectedPlan.additional_advice}
            </Text>
          </View>
        )}
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      {renderUserProfile()}
      {renderDietPlans()}
      {renderSelectedPlanDetails()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 10,
  },
  sectionContainer: {
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2c3e50",
  },
  profileSection: {
    marginBottom: 16,
  },
  profileLabel: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#34495e",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "#e6f2ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    margin: 4,
  },
  chipText: {
    fontSize: 12,
    color: "#2980b9",
  },
  actionContainer: {
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: "#3498db",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#ecf0f1",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  secondaryButtonText: {
    marginLeft: 10,
    fontWeight: "600",
    color: "#2c3e50",
  },
  formContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },
  planCard: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  selectedPlanCard: {
    borderColor: "#3498db",
    borderWidth: 2,
  },
  planCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  planDescription: {
    color: "#7f8c8d",
    marginVertical: 8,
  },
  planDate: {
    fontSize: 12,
    color: "#95a5a6",
  },
  mealSection: {
    marginBottom: 16,
  },
  mealTitle: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#16a085",
  },
  mealText: {
    color: "#2c3e50",
    lineHeight: 22,
  },
  adviceSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#e8f8f5",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#1abc9c",
  },
  adviceTitle: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#1abc9c",
  },
  adviceText: {
    color: "#34495e",
  },
});

export default DietRecommendations;
