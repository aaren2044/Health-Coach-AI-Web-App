import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

type Step = "basic" | "health" | "vitals" | "lifestyle";
interface FormData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  phone: string;
  conditions: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  wearableDevice: string;
  bloodSugar: string;
  heartRate: string;
  bloodPressure: string;
  dietaryRestrictions: string[];
  exercisePreference: string[];
  healthGoals: string[];
}

const initialFormData: FormData = {
  name: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  phone: "",
  conditions: [],
  medications: [],
  wearableDevice: "",
  bloodSugar: "",
  heartRate: "",
  bloodPressure: "",
  dietaryRestrictions: [],
  exercisePreference: [],
  healthGoals: [],
};

const chronicConditions = [
  "Type 1 Diabetes",
  "Type 2 Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "COPD",
  "Arthritis",
  "Obesity",
  "Other",
];

const dietaryRestrictions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Low-Sodium",
  "Low-Carb",
  "Kosher",
  "Halal",
  "None",
];

const exercisePreferences = [
  "Walking",
  "Running",
  "Swimming",
  "Cycling",
  "Yoga",
  "Weight Training",
  "HIIT",
  "Low Impact",
];

const healthGoals = [
  "Weight Loss",
  "Better Blood Sugar Control",
  "Lower Blood Pressure",
  "Increased Fitness",
  "Better Sleep",
  "Stress Management",
  "Medication Adherence",
];

export default function ProfileSetup() {
  const [currentStep, setCurrentStep] = useState<Step>("basic");
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    const steps: Step[] = ["basic", "health", "vitals", "lifestyle"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    const steps: Step[] = ["basic", "health", "vitals", "lifestyle"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // In a real app, you'd handle submission here
    alert("Profile setup completed!");
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        {["basic", "health", "vitals", "lifestyle"].map((step, index) => (
          <View key={step} style={styles.stepIndicatorWrapper}>
            <View
              style={[
                styles.stepIndicator,
                currentStep === step
                  ? styles.activeStepIndicator
                  : styles.inactiveStepIndicator,
              ]}
            />
            {index < 3 && <View style={styles.stepConnector} />}
          </View>
        ))}
      </View>
    );
  };

  const renderBasicInfo = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.name}
        onChangeText={(text) => updateFormData("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={formData.age}
        onChangeText={(text) => updateFormData("age", text)}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.gender}
          onValueChange={(itemValue) => updateFormData("gender", itemValue)}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
          <Picker.Item label="Prefer not to say" value="Prefer not to say" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={formData.height}
        onChangeText={(text) => updateFormData("height", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={formData.weight}
        onChangeText={(text) => updateFormData("weight", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => updateFormData("phone", text)}
      />
    </View>
  );

  const renderHealthConditions = () => (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Chronic Conditions</Text>
      {chronicConditions.map((condition) => (
        <View key={condition} style={styles.checkboxContainer}>
          <Text>{condition}</Text>
          <Switch
            value={formData.conditions.includes(condition)}
            onValueChange={(value) => {
              if (value) {
                updateFormData("conditions", [
                  ...formData.conditions,
                  condition,
                ]);
              } else {
                updateFormData(
                  "conditions",
                  formData.conditions.filter((c) => c !== condition)
                );
              }
            }}
          />
        </View>
      ))}

      <Text style={styles.sectionTitle}>Medications</Text>
      {formData.medications.map((med, index) => (
        <View key={index} style={styles.medicationRow}>
          <TextInput
            style={styles.medicationInput}
            placeholder="Medication Name"
            value={med.name}
            onChangeText={(text) => {
              const newMeds = [...formData.medications];
              newMeds[index].name = text;
              updateFormData("medications", newMeds);
            }}
          />
          <TextInput
            style={styles.medicationInput}
            placeholder="Dosage"
            value={med.dosage}
            onChangeText={(text) => {
              const newMeds = [...formData.medications];
              newMeds[index].dosage = text;
              updateFormData("medications", newMeds);
            }}
          />
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          updateFormData("medications", [
            ...formData.medications,
            { name: "", dosage: "", frequency: "" },
          ])
        }
      >
        <Text style={styles.addButtonText}>Add Medication</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderVitalsIntegration = () => (
    <View style={styles.formContainer}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.wearableDevice}
          onValueChange={(itemValue) =>
            updateFormData("wearableDevice", itemValue)
          }
        >
          <Picker.Item label="Select Device" value="" />
          <Picker.Item label="Apple Watch" value="apple-watch" />
          <Picker.Item label="Fitbit" value="fitbit" />
          <Picker.Item label="Samsung Galaxy Watch" value="samsung" />
          <Picker.Item label="Garmin" value="garmin" />
          <Picker.Item label="No Device" value="none" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Blood Sugar (mg/dL)"
        keyboardType="numeric"
        value={formData.bloodSugar}
        onChangeText={(text) => updateFormData("bloodSugar", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Heart Rate (bpm)"
        keyboardType="numeric"
        value={formData.heartRate}
        onChangeText={(text) => updateFormData("heartRate", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Blood Pressure (mmHg)"
        value={formData.bloodPressure}
        onChangeText={(text) => updateFormData("bloodPressure", text)}
      />
    </View>
  );

  const renderLifestyleGoals = () => (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
      {dietaryRestrictions.map((restriction) => (
        <View key={restriction} style={styles.checkboxContainer}>
          <Text>{restriction}</Text>
          <Switch
            value={formData.dietaryRestrictions.includes(restriction)}
            onValueChange={(value) => {
              if (value) {
                updateFormData("dietaryRestrictions", [
                  ...formData.dietaryRestrictions,
                  restriction,
                ]);
              } else {
                updateFormData(
                  "dietaryRestrictions",
                  formData.dietaryRestrictions.filter((r) => r !== restriction)
                );
              }
            }}
          />
        </View>
      ))}

      <Text style={styles.sectionTitle}>Exercise Preferences</Text>
      {exercisePreferences.map((exercise) => (
        <View key={exercise} style={styles.checkboxContainer}>
          <Text>{exercise}</Text>
          <Switch
            value={formData.exercisePreference.includes(exercise)}
            onValueChange={(value) => {
              if (value) {
                updateFormData("exercisePreference", [
                  ...formData.exercisePreference,
                  exercise,
                ]);
              } else {
                updateFormData(
                  "exercisePreference",
                  formData.exercisePreference.filter((ex) => ex !== exercise)
                );
              }
            }}
          />
        </View>
      ))}

      <Text style={styles.sectionTitle}>Health Goals</Text>
      {healthGoals.map((goal) => (
        <View key={goal} style={styles.checkboxContainer}>
          <Text>{goal}</Text>
          <Switch
            value={formData.healthGoals.includes(goal)}
            onValueChange={(value) => {
              if (value) {
                updateFormData("healthGoals", [...formData.healthGoals, goal]);
              } else {
                updateFormData(
                  "healthGoals",
                  formData.healthGoals.filter((g) => g !== goal)
                );
              }
            }}
          />
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderStepIndicator()}

      <View style={styles.contentContainer}>
        {currentStep === "basic" && renderBasicInfo()}
        {currentStep === "health" && renderHealthConditions()}
        {currentStep === "vitals" && renderVitalsIntegration()}
        {currentStep === "lifestyle" && renderLifestyleGoals()}
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentStep === "basic" && styles.disabledButton,
          ]}
          onPress={handleBack}
          disabled={currentStep === "basic"}
        >
          <Text style={styles.navButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <Text style={styles.navButtonText}>
            {currentStep === "lifestyle" ? "Complete" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  stepIndicatorWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  activeStepIndicator: {
    backgroundColor: "#007bff",
  },
  inactiveStepIndicator: {
    backgroundColor: "#ddd",
  },
  stepConnector: {
    height: 2,
    backgroundColor: "#ddd",
    width: 50,
    marginHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  medicationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  medicationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#007bff",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  navButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ddd",
  },
  navButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
