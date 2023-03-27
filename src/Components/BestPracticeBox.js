import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
// NPM
import LinearGradient from 'react-native-linear-gradient';
// CUSTOM
import styles from '../Styles/CBAB.module';

export default function BestPracticeBox({navigation}) {
  const handlePress = () => {
    navigation.navigate('BestPracticeScreen');
  };

  return (
    <TouchableOpacity onPress={() => handlePress()}>
      <View style={[styles.articleTypeBox, styles.boxOrange]}>
        <Image
          source={{
            uri: 'https://images.ctfassets.net/kst95g92kfwh/7oI7keMzROZODFQ0R4v072/2055f70b3fe232cd2e35eef4a1f56fa9/sharingBestPractices.jpg',
          }}
          style={styles.boxImage}
          resizeMode="cover"
        />
        <Text style={styles.boxText}>Sharing Best Practice</Text>
      </View>
      <View style={styles.boxGradient}>
        <LinearGradient
          locations={[0.5, 0.5]}
          colors={['#e47317', 'rgba(0, 0, 0, 0)']}
          height={25}
          {...{
            useAngle: true,
            angle: 175,
            angleCenter: {x: 0.5, y: 0.5},
          }}></LinearGradient>
      </View>
    </TouchableOpacity>
  );
}
