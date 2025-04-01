import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Calendar,
  Clock,
  Syringe,
  Stethoscope,
  Droplet,
  Activity,
  Plus,
  Check,
  X,
} from "lucide-react-native";

export default function TasksScreen() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Blood Pressure Check",
      date: "2024-02-15",
      time: "09:30 AM",
      type: "checkup",
      completed: false,
      icon: Activity,
    },
    {
      id: "2",
      title: "Blood Sugar Test",
      date: "2024-02-15",
      time: "08:00 AM",
      type: "test",
      completed: false,
      icon: Droplet,
    },
    {
      id: "3",
      title: "Doctor Appointment",
      date: "2024-02-16",
      time: "02:30 PM",
      type: "appointment",
      completed: false,
      icon: Stethoscope,
    },
    {
      id: "4",
      title: "Take Insulin",
      date: "2024-02-15",
      time: "07:00 PM",
      type: "medication",
      completed: false,
      icon: Syringe,
    },
  ]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTask,
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "custom",
          completed: false,
          icon: Calendar,
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "checkup":
        return "#10B981";
      case "test":
        return "#3B82F6";
      case "appointment":
        return "#6366F1";
      case "medication":
        return "#EC4899";
      default:
        return "#6B7280";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Tasks</Text>
        <Text style={styles.subtitle}>
          Track your medical appointments and checkups
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Add new task..."
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Plus color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
        {tasks.map((task) => (
          <View
            key={task.id}
            style={[
              styles.taskCard,
              task.completed && styles.taskCardCompleted,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.taskCheckbox,
                task.completed && styles.taskCheckboxCompleted,
              ]}
              onPress={() => toggleTask(task.id)}
            >
              {task.completed && <Check size={16} color="#FFFFFF" />}
            </TouchableOpacity>

            <View style={styles.taskContent}>
              <View style={styles.taskHeader}>
                <task.icon size={20} color={getTypeColor(task.type)} />
                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted,
                  ]}
                >
                  {task.title}
                </Text>
              </View>

              <View style={styles.taskDetails}>
                <View style={styles.taskTime}>
                  <Calendar size={14} color="#6B7280" />
                  <Text style={styles.taskTimeText}>{task.date}</Text>
                </View>
                <View style={styles.taskTime}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.taskTimeText}>{task.time}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTask(task.id)}
            >
              <X size={16} color="#EF4444" />
            </TouchableOpacity>
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
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#111827",
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: "#6366F1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  taskList: {
    flex: 1,
    padding: 16,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
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
  taskCardCompleted: {
    opacity: 0.7,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#6366F1",
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  taskCheckboxCompleted: {
    backgroundColor: "#6366F1",
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#111827",
    marginLeft: 8,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#6B7280",
  },
  taskDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskTime: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  taskTimeText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});
