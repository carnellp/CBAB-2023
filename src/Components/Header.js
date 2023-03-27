import {ImageBackground, Text, View} from 'react-native';
import React from 'react';
// NPM
// CUSTOM
import styles from '../Styles/CBAB.module';
import blueImage from '../assets/headingBG.jpg';
import orangeImage from '../assets/headingBestBG.png';

export default function Header({title, image}) {
  return (
    <View>
      <ImageBackground
        source={image == 'orange' ? orangeImage : blueImage}
        resizeMode="cover"
        style={{padding: 20}}>
        <Text style={styles.headerTitle}>{title}</Text>
      </ImageBackground>
    </View>
  );
}
