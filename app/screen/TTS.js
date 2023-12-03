import React, { useState, useEffect } from "react";

import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  Keyboard,
} from "react-native";

import * as Speech from "expo-speech";

import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Slider from "@react-native-community/slider";
import SelectDropdown from "react-native-select-dropdown";

export default function TTS({ route, navigation }) {
  const text = route?.params?.text ? route.params.text : "";
  const [input, setInput] = useState("");
  const [rate, setRate] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [checked, setChecked] = useState(false);
  const [isTouchEndedRate, setIsTouchEndedRate] = useState(false);
  const [isTouchEndedPitch, setIsTouchEndedPitch] = useState(false);
  const [language, setLanguage] = useState("English");
  const lan = ["English", "Vietnamese"];

  useEffect(() => {
    setInput(text);
  }, [text]);

  useEffect(() => {
    setPitch(pitch);
  }, [pitch]);

  useEffect(() => {
    setRate(rate);
  }, [rate]);

  function speak(pitch_, rate_, language_) {
    const thingsToSay = input;
    if (language_ === "English") {
      language_ = "en";
    } else {
      language_ = "vi";
    }
    const options = {
      language: language_,
      pitch: pitch_,
      rate: rate_,
    };
    Speech.speak(thingsToSay, options);
  }

  return (
    <View style={styles.container}>
      <FontAwesome
        name="gear"
        size={40}
        color={"#2596be"}
        style={[styles.gearIcon, { padding: 20 }]}
        onPress={() => {
          setChecked(!checked);
        }}
      ></FontAwesome>
      {checked ? (
        <>
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontFamily: "Montserrat" }}>Pitch</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={isTouchEndedPitch ? pitch : 0}
              // value = {pitch}
              onValueChange={(e) => setPitch(e)}
              onTouchEnd={() => setIsTouchEndedPitch(true)}
              onTouchStart={() => setIsTouchEndedPitch(false)}
              minimumTrackTintColor="#2596be"
            />
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontFamily: "Montserrat" }}>Rate</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={isTouchEndedRate ? rate : 0}
              onValueChange={(e) => setRate(e)}
              onTouchEnd={() => setIsTouchEndedRate(true)}
              onTouchStart={() => setIsTouchEndedRate(false)}
              minimumTrackTintColor="#2596be"
            />
          </View>
        </>
      ) : (
        ""
      )}
      <SelectDropdown
        data={lan}
        onSelect={(selectedItem, index) => {
          setLanguage(selectedItem);
        }}
        defaultButtonText={"English"}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        buttonStyle={styles.dropdown1BtnStyle}
        buttonTextStyle={styles.dropdown1BtnTxtStyle}
        renderDropdownIcon={(isOpened) => {
          return (
            <FontAwesome
              name={isOpened ? "chevron-up" : "chevron-down"}
              color={"#444"}
              size={18}
            />
          );
        }}
        dropdownIconPosition={"right"}
        dropdownStyle={styles.dropdown1DropdownStyle}
        rowStyle={styles.dropdown1RowStyle}
        rowTextStyle={styles.dropdown1RowTxtStyle}
      />
      <View style={styles.setting}>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.text}
            placeholder="Enter your text here"
            value={input}
            onChangeText={(text) => setInput(text)}
            multiline={true}
            numberOfLines={5}
            textAlign={"center"}
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />
        </View>
        <View
          style={{
            marginTop: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={styles.speech}
            onPress={() => {
              speak(pitch, rate, language);
            }}
          >
            <FontAwesome5 name="volume-up" size={30} color={"#2596be"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: "#7ae3f3",
    justifyContent: "center",
    alignItems: "center",
  },
  gearIcon: {
    position: 'absolute',
    top: 10, // Adjust the top position according to your requirement
    right: 10, // Adjust the right position according to your requirement
  },
  textInputContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "rgba(0, 0, 0, 0.125)",
    borderBottomWidth: 2,
    borderRadius: 10,
  },
  text: {
    width: "100%",
    height: 200,
    fontSize: 20,
    color: "black",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 4,
    padding: 8,
    fontFamily: "Montserrat",
  },
  setting: {
    marginTop: 24,
    width: "90%",
    color: "black",
    fontSize: 20,
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  speech: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
    width: 60,
    padding: 10,
    height: 60,
  },
  header: {
    top: 10,
    color: "black",
    height: 45,
    fontSize: 28.84,
    textAlign: "center",
    fontWeight: "bold",
  },
  showtext: {
    textAlign: "center",
    fontSize: 25,
    color: "white",
  },
  slider: {
    width: 300,
  },
  dropdownsRow: { flexDirection: "row", width: "50%" },

  dropdown1BtnStyle: {
    alignSelf: "center",
    top: 10,
    backgroundColor: "#FFF",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#444",
  },
  dropdown1BtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: {
    color: "#444",
    textAlign: "center",
    borderBottomColor: "#C5C5C5",
  },
  divider: { width: 12 },
  dropdown2BtnStyle: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdown2BtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdown2DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown2RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown2RowTxtStyle: { color: "#444", textAlign: "left" },
});
