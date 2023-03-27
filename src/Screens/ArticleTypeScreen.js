import {
  ActivityIndicator,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// NPM
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {Overlay} from 'react-native-elements';
// CUSTOM
import ArticleListItem from '../Components/ArticleListItem';
import Header from '../Components/Header';
import NavBar from '../Components/NavBar';
import styles from '../Styles/CBAB.module';
import bgImage from '../assets/navyBG.jpg';
import footerImg from '../assets/challengingBeliefs.png';

export default function ArticleTypeScreen({navigation, route}) {
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState();
  const [isBurgerVisable, setIsBurgerVisable] = useState(false);

  useEffect(() => {
    axios({
      method: 'get',
      url:
        'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50&content_type=article&fields.articleCategory.sys.id=' +
        route.params.articleTypeID,
    }).then(response => {
      setTitle(response.data.includes.Entry[0].fields.title);
      setArticles(response.data.items);
      setIsLoading(false);
    });
  });

  articles.sort((a, b) => a.fields.articleOrder - b.fields.articleOrder);

  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={{flex: 1}}>
        <NavBar navigation={navigation} showBack={false} />
        <Header title={title} />
        <ImageBackground
          source={bgImage}
          resizeMode="cover"
          style={{
            flexGrow: 1,
          }}>
          <View style={[styles.justifyCenter, styles.leftIndent]}>
            <ScrollView style={{flex: 1}}>
              {articles.map((article, i) => {
                return (
                  <ArticleListItem
                    key={i}
                    navigation={navigation}
                    articles={articles}
                    i={i}
                  />
                );
              })}
              <View
                style={isLoading ? styles.loadingContainer : {display: 'none'}}>
                <ActivityIndicator
                  animating={isLoading}
                  size="large"
                  color="#ffffff"
                />
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
        <View style={{backgroundColor: '#000000', alignItems: 'center'}}>
          <Image
            source={footerImg}
            style={{width: 171, height: 90}}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
