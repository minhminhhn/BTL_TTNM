import { Dimensions } from "react-native";
const {width, height} = Dimensions.get("window");

export const COLORS = {
    primary: "#2596be",
    secondary: 'rgba(0, 0, 0, 0.125)',
    accent: "#2596be",

    success: "#00C851",
    error: "#FF4444",

    black: "#171717",
    white: "#fff",
    background: "#F8EDEB"
}

export const SIZES = {
    base: 10,
    width,
    height
}