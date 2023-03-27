import {Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
// NPM
// CUSTOM
import styles from '../Styles/CBAB.module';

export default function BurgerListItem({navigation, setIsBurgerVisable, page}) {
  const handlePress = () => {
    if (page.fields.title == 'Home') {
      navigation.navigate('HomeScreen');
    } else if (page.sys.contentType.sys.id == 'bestPractice') {
      navigation.navigate(page.sys.componentName);
    } else if (page.sys.contentType.sys.id == 'staticPages') {
      navigation.push('CustomStaticPage', {
        title: page.fields.title,
        content: page.fields.pageContent,
      });
    } else if (page.sys.contentType.sys.id == 'articleType') {
      navigation.push('ArticleTypeScreen', {
        articleTitle: page.fields.title,
        articleTypeID: page.sys.id,
      });
    }
    setIsBurgerVisable(false);
  };

  return (
    <View style={styles.burgerItemContainer}>
      <TouchableOpacity
        onPress={e => handlePress(e)}
        style={styles.burgerItemBtn}>
        <Text style={styles.burgerItemText}>{page.fields.title}</Text>
      </TouchableOpacity>
    </View>
  );
}
