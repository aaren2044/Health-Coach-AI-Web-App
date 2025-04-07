import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
  FlatList,
} from "react-native";

interface ArticleProps {
  author: string;
  description: string;
  url: string;
  urlToImage: string;
  title: string;
}

const Article: React.FC<ArticleProps> = ({
  author,
  description,
  url,
  urlToImage,
  title,
}) => {
  const handlePress = () => {
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {urlToImage && (
        <Image
          source={{ uri: urlToImage }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {author || "Unknown Author"}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const articles = [
  {
    author: "ABP News",
    title: "HMPV चा पहिला रुग्ण आढळला, महाराष्ट्र सरकार अलर्ट मोडवर",
    description:
      "HMPV व्हायरसमुळे महाराष्ट्रातील आरोग्य विभाग सतर्क झाले आहेत. सर्दी आणि खोकल्याच्या रुग्णांचं सर्वेक्षण करण्याचे निर्देश देण्यात आले आहेत.",
    url: "https://marathi.abplive.com/news",
    urlToImage: "https://via.placeholder.com/400x200",
  },
  {
    author: "Loksatta",
    title: "HMPV म्हणजे काय? हा विषाणू किती धोकादायक आहे?",
    description:
      "HMPV व्हायरस चीनमध्ये वेगाने पसरत आहे आणि त्यामुळे महाराष्ट्रात चिंता वाढली आहे.",
    url: "https://www.loksatta.com/photos",
    urlToImage: "https://via.placeholder.com/400x200",
  },
  {
    author: "Zee News",
    title: "महाराष्ट्र आजारी पडतोय; पुन्हा मास्क वापरावा लागणार?",
    description:
      "राज्यात सुरू असलेल्या पावसामुळे आजारांचे प्रमाण वाढले आहे. यामुळे आरोग्य यंत्रणांची चिंता वाढली आहे.",
    url: "https://zeenews.india.com/mumbai",
    urlToImage: "https://via.placeholder.com/400x200",
  },
  {
    author: "Lokmat",
    title: "Corona Virus News in Marathi",
    description:
      "ताज्या कोरोनाच्या घडामोडी, प्रतिबंधात्मक उपाय आणि महाराष्ट्रातील अपडेट्स जाणून घ्या.",
    url: "https://www.lokmat.com/topics",
    urlToImage: "https://via.placeholder.com/400x200",
  },
];

const ArticleList = () => {
  return (
    <FlatList
      data={articles}
      renderItem={({ item }) => <Article {...item} />}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    backgroundColor: "#F5F5F5",
  },
  container: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },
  textContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#444",
  },
});

export default ArticleList;
