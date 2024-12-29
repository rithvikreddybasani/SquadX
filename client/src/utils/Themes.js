

var defaultColor =  '#' + Math.floor(Math.random() * 16777215).toString(16);

if(defaultColor === '#000000' || defaultColor === '#ffffff' || defaultColor === '#191924'){
  defaultColor =  '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// bg-primary px-8 
export const darkTheme = {
  bg: "#0A0A0A", // Very dark background
  bgLight: "#101010", // Slightly lighter dark background
  primary: "#3F0071", // Deep, rich purple for primary color
  primary_shadow: "#2C0065", // Even darker shadow for primary color
  text_primary: "#B0B0B0", // Light gray text for primary text
  text_secondary: "#8C8C8C", // Darker gray for secondary text
  card: "#0A0A0A", // Darkest card background
  card_light: "#101010", // Lighter dark background for cards
  button: "#512DA8", // Dark purple button background
  white: "#E5E5E5", // Off-white text for more muted contrast
  black: "#000000", // Absolute black for certain elements
};


export const lightTheme = {
    bg: "#FFFFFF",
    bgLight: "#f0f0f0",
    primary: defaultColor,
    text_primary: "#111111",
    text_secondary: "#48494a",
    card: "#FFFFFF",
    button: "#5c5b5b",
}



