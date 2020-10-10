import React, { useEffect, useState, useCallback } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import api, { baseURL } from "../../services/api";
import socket from "../../services/socketConfig";

import { COLOR, Divider } from "react-native-material-ui";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FlatList } from "react-native-gesture-handler";

const uiTheme = {
  palette: {
    primaryColor: COLOR.white,
    secondaryColor: COLOR.black,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  postItem: {
    marginTop: 20,
  },

  postItemHeader: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  author: {
    fontSize: 14,
    color: "#000",
  },

  place: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  postImage: {
    width: "100%",
    height: 400,
    marginVertical: 15,
  },

  postItemFooter: {
    paddingHorizontal: 15,
  },

  postLikes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },

  likes: {
    marginRight: 15,
    fontWeight: "bold",
    color: "#000",
  },

  descriptions: {
    lineHeight: 18,
    marginBottom: 5,
    color: "#000",
  },

  hashtags: {
    color: "blue",
    marginBottom: 20,
  },
});

interface Items {
  item: {
    _id: string;
    author: string;
    place: string;
    likes: string;
    description: string;
    hashtags: string;
    image: string;
  };
}

const Home = ({ navigation }) => {
  navigation.setOptions({
    headerRight: () => (
      <TouchableHighlight
        style={{ marginRight: 20 }}
        onPressOut={() => navigation.navigate("Create")}
      >
        <Icon
          name="camera-enhance"
          color={uiTheme.palette.primaryColor}
          size={25}
        />
      </TouchableHighlight>
    ),
  });

  const [statePost, setStatePost] = useState<any>([]);
  const [stateLoading, setStateLoading] = useState<boolean>(false);

  const [stateLiker, setStateLiker] = useState<boolean>(false);

  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(1500).then(() => setRefreshing(false));
  }, [refreshing]);

  const handleLiker = async (id: string | undefined) => {
    await api.post(`/posts/${id}/like`);
    setStateLiker(true);
  };

  const registerToSocket = () => {
    socket.on("post", (newPost: any) => {
      setStatePost([newPost, ...statePost]);
    });
    socket.on("like", (likedPost: any) => {
      setStatePost(
        statePost.map((post: any) =>
          post._id === likedPost._id ? likedPost : post
        )
      );
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get("/posts");
        setStatePost(response.data);
        setStateLoading(true);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  registerToSocket();

  return (
    <View>
      {stateLoading ? (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={statePost}
          keyExtractor={(post) => post._id}
          renderItem={({ item }: Items) => (
            <View key={item._id} style={styles.postItem}>
              <View style={styles.postItemHeader}>
                <View>
                  <Text style={styles.author}>{item.author}</Text>
                  <Text style={styles.place}>{item.place}</Text>
                </View>
              </View>
              <Image
                style={styles.postImage}
                source={{ uri: `${baseURL}/files/${item.image}` }}
              />
              <View style={styles.postItemFooter}>
                <View style={styles.postLikes}>
                  <TouchableOpacity
                    onPress={() => {
                      handleLiker(item._id);
                    }}
                  >
                    <Icon name="heart-outline" style={styles.likes} size={25} />
                  </TouchableOpacity>
                  <Text style={styles.likes}>{item.likes} curtidas</Text>
                </View>
                <Text style={styles.descriptions}>{item.description}</Text>
                <Text style={styles.hashtags}>{item.hashtags}</Text>
              </View>
              <Divider />
            </View>
          )}
        />
      ) : (
        <View style={{ flex: 1, alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

export default Home;
