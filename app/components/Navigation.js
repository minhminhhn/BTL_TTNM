import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dictionary from "../screen/Search.js";
import Learn from "../screen/Learn.js";
import Recognition from "../screen/Recognition.js";
import TTS from "../screen/TTS.js";
import { FontAwesome5 } from "@expo/vector-icons";
import { View } from "react-native";

const Tab = createBottomTabNavigator();

function Navigation() {
  return (
      <Tab.Navigator
        screenOptions={{
          tabBarInactiveTintColor: "#CDCCCE",
          tabBarActiveTintColor: "#130b43",
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Learn"
          component={Learn}
          options={{
            animationEnabled: true,
            header: () => null,
            tabBarIcon: ({ focused, color }) => (
              <FontAwesome5
                name="book"
                size={24}
                color={focused ? "#2596be" : "#CDCCCE"}
              />
            ),
          }}
        />
        {/* <Tab.Screen
          name="Recognition"
          component={Recognition}
          options={{
            animationEnabled: true,
            header: () => null,
            tabBarStyle: {
              display: "none",
            },
            tabBarIcon: ({ focused, color }) => (
              <FontAwesome5
                name="camera"
                size={24}
                color={focused ? "#2596be" : "#CDCCCE"}
              />
            ),
          }}
        /> */}
        <Tab.Screen
          name="Dictionary"
          component={Dictionary}
          options={{
            animationEnabled: true,
            header: () => null,
            tabBarIcon: ({ focused, color }) => (
              <FontAwesome5
                name="search"
                size={24}
                color={focused ? "#2596be" : "#CDCCCE"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="TTS"
          component={TTS}
          options={{
            animationEnabled: true,
            header: () => null,
            tabBarIcon: ({ focused, color }) => (
              <FontAwesome5
                name="assistive-listening-systems"
                size={24}
                color={focused ? "#2596be" : "#CDCCCE"}
              />
            ),
          }}
        />
      </Tab.Navigator>
  );
}

export default Navigation;
