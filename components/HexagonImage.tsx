import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import Svg, { ClipPath, Polygon, Rect, Defs,Image as SvgImage } from 'react-native-svg';
import { themeSettings } from '../constants/Colors'; // Assuming you have a themeSettings function to get colors

interface Props {
  uri?: string; // Make the uri prop optional
  style?: StyleProp<ViewStyle>;
  onPress?:()=>void;
}

const colors = themeSettings('dark'); // Assuming 'dark' theme is being used

const HexagonImage: React.FC<Props> = ({ uri,style,onPress }) => {
  return (
    <TouchableOpacity style={[styles.container,style]} onPress={onPress}>
      <Svg height="60" width="60" viewBox="0 0 100 100">
        <Defs>
          <ClipPath id="hexagonClip">
            <Polygon points="50,1 90,25 90,75 50,99 10,75 10,25" />
          </ClipPath>
        </Defs>

        {uri && uri.trim() !== '' ? (
          <SvgImage
            href={{ uri: uri }}
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#hexagonClip)"
          />
        ) : (
          <Rect
            width="100"
            height="100"
            fill={colors.colors.primary.main} // Use primary color as the background
            clipPath="url(#hexagonClip)"
          />
        )}
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 15,
  },
});

export default HexagonImage;
