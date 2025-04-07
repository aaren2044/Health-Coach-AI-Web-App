import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MessageCircle, Heart, Share2, ChevronLeft } from "lucide-react-native";
import { useState } from "react";

type Story = {
  id: string;
  username: string;
  avatar: string;
  title: string;
  content: string;
  disease: string;
  duration: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
};

export default function CommunityScreen() {
  const [newStory, setNewStory] = useState("");
  const [stories, setStories] = useState<Story[]>([
    {
      id: "1",
      username: "Rahul_Mumbai",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      title: "My journey with Crohn's Disease",
      content:
        "After being diagnosed 5 years ago, I struggled with daily pain and fatigue. Through a combination of medication, dietary changes (especially the Mumbai-specific diet), and yoga, I've managed to achieve remission. The key for me was listening to my body and not pushing too hard on bad days. Happy to answer any questions!",
      disease: "Crohn's Disease",
      duration: "5 years",
      likes: 42,
      comments: 8,
      shares: 3,
      timestamp: "2 days ago",
    },
    {
      id: "2",
      username: "Priya_Delhi",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      title: "Living with Type 1 Diabetes",
      content:
        "Diagnosed at age 12, I've learned to manage my blood sugar through careful meal planning and regular exercise. The Indian diet makes it challenging but not impossible. My advice: Don't let the disease define you. I've completed two half-marathons since my diagnosis!",
      disease: "Type 1 Diabetes",
      duration: "15 years",
      likes: 78,
      comments: 12,
      shares: 5,
      timestamp: "1 week ago",
    },
    {
      id: "3",
      username: "Amit_Bangalore",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      title: "Overcoming Rheumatoid Arthritis",
      content:
        "The pain was unbearable at first, but with the right treatment plan and support group, I've regained 90% mobility. Swimming and turmeric supplements have been game-changers for me. Remember: Progress isn't linear - celebrate small victories!",
      disease: "Rheumatoid Arthritis",
      duration: "3 years",
      likes: 56,
      comments: 7,
      shares: 2,
      timestamp: "3 days ago",
    },
  ]);

  const handleLike = (id: string) => {
    setStories(
      stories.map((story) =>
        story.id === id ? { ...story, likes: story.likes + 1 } : story
      )
    );
  };

  const handleShare = () => {
    // Share functionality would go here
    alert("Story shared!");
  };

  const handlePost = () => {
    if (newStory.trim()) {
      const newPost: Story = {
        id: Date.now().toString(),
        username: "Aaren Solanki",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        title: "My Experience",
        content: newStory,
        disease: "Cancer",
        duration: "1+ years",
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: "Just now",
      };
      setStories([newPost, ...stories]);
      setNewStory("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inspiration Community</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.postContainer}>
          <Text style={styles.sectionTitle}>Share Your Story</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Share your experience with chronic illness and how you've managed..."
            value={newStory}
            onChangeText={setNewStory}
          />
          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recent Stories</Text>

        {stories.map((story) => (
          <View key={story.id} style={styles.storyCard}>
            <View style={styles.storyHeader}>
              <Image source={{ uri: story.avatar }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.username}>{story.username}</Text>
                <Text style={styles.diseaseInfo}>
                  {story.disease} • {story.duration}
                </Text>
              </View>
              <Text style={styles.timestamp}>{story.timestamp}</Text>
            </View>

            <Text style={styles.storyTitle}>{story.title}</Text>
            <Text style={styles.storyContent}>{story.content}</Text>

            <View style={styles.storyFooter}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(story.id)}
              >
                <Heart size={18} color="#EF4444" />
                <Text style={styles.actionText}>{story.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={18} color="#6B7280" />
                <Text style={styles.actionText}>{story.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Share2 size={18} color="#6B7280" />
                <Text style={styles.actionText}>{story.shares}</Text>
              </TouchableOpacity>
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
    backgroundColor: "#F3F4F6",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  postContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    textAlignVertical: "top",
  },
  postButton: {
    backgroundColor: "#6366F1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  storyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: "600",
    color: "#1F2937",
  },
  diseaseInfo: {
    fontSize: 12,
    color: "#6B7280",
  },
  timestamp: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  storyContent: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 16,
  },
  storyFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 6,
    color: "#6B7280",
  },
});
