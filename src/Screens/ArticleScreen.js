import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// NPM
import axios from 'axios';
import FileViewer from 'react-native-file-viewer';
import Markdown from 'react-native-markdown-package';
import {Overlay} from 'react-native-elements';
// CUSTOM
import NavBar from '../Components/NavBar';
import styles from '../Styles/CBAB.module';
import backArrow from '../assets/arrow-left.png';
import bgImage from '../assets/footerBG.jpg';
import nextArrow from '../assets/arrow-right.png';
import quoteBG from '../assets/blockquoteOneBG.png';

export default function ArticleScreen({route, navigation}) {
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState(route.params.articles);
  const [i, setI] = useState(route.params.i);
  const [currentArticle, setCurrentArticle] = useState(
    articles[route.params.i],
  );
  const [articleTitle, setArticleTitle] = useState();
  const [articleMarkup, setArticleMarkup] = useState();
  const [imgID, setImgID] = useState();
  const [imageLink, setImageLink] = useState();

  useEffect(() => {
    axios({
      method: 'get',
      url:
        'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries/' +
        currentArticle.sys.id +
        '?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50',
    }).then(response => {
      setArticleTitle(response.data.fields.title);
      setArticleMarkup(response.data.fields.articleMarkup);
      setImgID(response.data.fields.headerImage.sys.id);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (imgID) {
      axios({
        method: 'get',
        url:
          'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/assets/' +
          imgID +
          '?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50',
      }).then(response => {
        setImageLink('https:' + response.data.fields.file.url);
      });
    }
  }, [imgID]);

  const handleBack = () => {
    console.log('Current is: ' + i);
    if (i == 0) {
      navigation.navigate('ArticleTypeScreen', {
        articleTypeID: currentArticle.fields.articleCategory.sys.id,
      });
    } else {
      console.log('Next is: ' + (i - 1));
      navigation.push('ArticleScreen', {articles: articles, i: i - 1});
    }
  };

  const handleNext = () => {
    console.log('Current is: ' + i);
    if (i + 1 == articles.length) {
      navigation.navigate('HomeScreen');
    } else {
      console.log('Pushing to ' + (i + 1));
      navigation.push('ArticleScreen', {articles: articles, i: i + 1});
    }
  };
  const onLinkCallback = url => {
    Linking.openURL('https:' + url);
    const isErrorResult = false;
    return new Promise((resolve, reject) => {
      isErrorResult ? reject() : resolve();
    });
  };

  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={{flex: 1}}>
        <NavBar navigation={navigation} showBack={false} />
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
          }}>
          <Image
            source={{uri: imageLink}}
            style={styles.articleImage}
            resizeMode="cover"
          />
          <View style={styles.bodyCont}>
            <Text style={[styles.articleCont, styles.articleHeading]}>
              {articleTitle}
            </Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.bodyCont}>
            <View style={styles.articleCont}>
              <Markdown
                styles={markdownStyle.collectiveMd}
                onLink={url => Linking.openURL(url)}>
                {isLoading ? '' : articleMarkup}
              </Markdown>
            </View>
          </View>
          <View style={isLoading ? styles.loadingContainer : {display: 'none'}}>
            <ActivityIndicator
              animating={isLoading}
              size="large"
              color="#000000"
            />
          </View>
        </ScrollView>
        <View
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            style={[styles.justifyCenter, styles.articleBack]}>
            <Image
              source={backArrow}
              style={{width: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <ImageBackground
            source={bgImage}
            style={{flex: 2}}
            resizeMode="cover">
            <TouchableOpacity onPress={handleNext} style={styles.articleNext}>
              <Text
                style={{color: '#ffffff', fontWeight: 'bold', fontSize: 16}}>
                Next category
              </Text>
              <Image
                source={nextArrow}
                style={{width: 20, marginLeft: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </SafeAreaView>
    </View>
  );
}

const markdownStyle = {
  collectiveMd: {
    text: {color: '#222222'},
    heading1: {
      textAlign: 'left',
    },
    heading2: {
      marginTop: 20,
      textAlign: 'left',
    },
    heading3: {
      marginVertical: '5%',
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'center',
      color: '#ffffff',
      fontSize: 18,
      padding: '5%',
      backgroundColor: '#b70d0b',
    },
    heading4: {
      marginVertical: '5%',
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'center',
      color: '#ffffff',
      fontSize: 18,
      padding: '5%',
      backgroundColor: '#488090',
    },
    autolink: {
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    image: {display: 'none'},
    list: {color: '#222222'},
    listItemText: {color: '#222222'},
    // heading1: {
    //   color: 'yellow',
    // },
    // heading2: {
    //   color: 'orange',
    //   textAlign: 'right',
    // },
    // heading3: {
    //   color: 'white',
    //   paddingBottom: 0,
    //   fontSize: 22,
    //   color: 'white',
    //   marginBottom: 0,
    //   paddingLeft: 20,
    //   backgroundColor: 'green',
    //   marginTop: 10,
    //   marginBottom: 10,
    // },

    // text: {
    //   color: '#575967',
    //   fontSize: 16,
    //   lineHeight: 22,
    //   marginBottom: 20,
    // },
    // strong: {
    //   fontWeight: 'bold',
    // },
    // em: {
    //   fontStlye: 'italic',
    // },
    // blockQuoteSection: {
    //   flexDirection: 'row',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // },
    // blockQuoteSectionBar: {
    //   width: 0,
    //   height: null,
    //   backgroundColor: '#DDDDDD',
    //   marginRight: 15,
    // },
  },
};
