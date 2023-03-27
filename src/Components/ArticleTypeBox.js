import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
// NPM
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
// CUSTOM

import styles from '../Styles/CBAB.module';

export default function ArticleTypeBox({type, navigation, boxColor}) {
  const [imageLink, setImageLink] = useState();
  const iconID = type.fields.icon.sys.id;

  useEffect(() => {
    axios({
      method: 'get',
      url:
        'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/assets/' +
        iconID +
        '?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50',
    }).then(response => {
      setImageLink(response.data.fields.file.url);
    });
  }, []);

  const handlePress = () => {
    navigation.navigate('ArticleTypeScreen', {
      articleTypeID: type.sys.id,
    });
  };

  return (
    <TouchableOpacity onPress={() => handlePress()}>
      <View
        style={
          boxColor == 'yellow'
            ? [styles.articleTypeBox, styles.boxYellow]
            : [styles.articleTypeBox, styles.boxBlue]
        }>
        <Image
          source={{uri: 'https:' + imageLink}}
          style={styles.boxImage}
          resizeMode="cover"
        />
        <Text style={styles.boxText}>{type.fields.title}</Text>
      </View>
      <View style={styles.boxGradient}>
        <LinearGradient
          locations={[0.5, 0.5]}
          colors={
            boxColor == 'yellow'
              ? ['#febd45', 'rgba(0, 0, 0, 0)']
              : ['#488090', 'rgba(0, 0, 0, 0)']
          }
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
