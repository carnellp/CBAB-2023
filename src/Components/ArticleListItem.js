import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
// NPM
// CUSTOM
import styles from '../Styles/CBAB.module';
import nextArrow from '../assets/arrow-right.png';

export default function ArticleListItem({navigation, articles, i}) {
  const [currentArticle, setCurrentArticle] = useState(articles[i]);

  const handlePress = e => {
    navigation.push('ArticleScreen', {articles: articles, i: i});
  };

  return (
    <View style={styles.articleListItemContainer}>
      <TouchableOpacity
        onPress={e => handlePress(e)}
        style={styles.articleListItemBtn}>
        <Text style={styles.articleListTitle}>
          {currentArticle.fields.title}
        </Text>
        <Image
          source={nextArrow}
          style={{width: 25, height: 20}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}
