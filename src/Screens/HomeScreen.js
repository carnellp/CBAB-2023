import {
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// NPM
import axios from 'axios';
// CUSTOM
import ArticleListItem from '../Components/ArticleListItem';
import ArticleTypeBox from '../Components/ArticleTypeBox';
import BestPracticeBox from '../Components/BestPracticeBox';
import Header from '../Components/Header';
import NavBar from '../Components/NavBar';
import styles from '../Styles/CBAB.module';
import bgImage from '../assets/navyBG.jpg';

export default function HomeScreen({navigation}) {
  const [isLoading, setIsLoading] = useState(true);
  const [articleTypes, setArticleTypes] = useState([]);

  const getArticleTypes = () => {
    axios({
      method: 'get',
      url: 'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50&content_type=articleType',
    }).then(response => {
      setArticleTypes(response.data.items);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getArticleTypes();
  }, []);

  articleTypes.sort((a, b) => a.fields.weight - b.fields.weight);

  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={{flex: 1}}>
        <NavBar navigation={navigation} showBack={false} />
        <Header title="Challenging Beliefs, Affecting Behaviour" />

        <ImageBackground
          source={bgImage}
          resizeMode="cover"
          style={{
            flexGrow: 1,
          }}>
          <ScrollView style={{flex: 1}}>
            <View style={[styles.bodyCont, styles.homeCont]}>
              {articleTypes.map((type, i) => {
                return (
                  <View
                    key={i}
                    style={
                      i % 2 == 0
                        ? [styles.homeBox, styles.leftCol]
                        : [styles.homeBox, styles.rightCol]
                    }>
                    <ArticleTypeBox
                      type={type}
                      navigation={navigation}
                      boxColor={
                        type.fields.title == 'Tools and Resources'
                          ? 'yellow'
                          : 'blue'
                      }
                    />
                  </View>
                );
              })}
              <View style={[styles.homeBox, styles.rightCol]}>
                <BestPracticeBox navigation={navigation} boxColor="#e47317" />
              </View>
            </View>
            <View
              style={isLoading ? styles.loadingContainer : {display: 'none'}}>
              <ActivityIndicator
                animating={isLoading}
                size="large"
                color="#ffffff"
              />
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
}
