import {View, Text, SafeAreaView, Linking, ScrollView} from 'react-native';
import React from 'react';
// NPM
import Markdown from 'react-native-markdown-package';
// CUSTOM
import Header from '../Components/Header';
import NavBar from '../Components/NavBar';
import styles from '../Styles/CBAB.module';

export default function CustomStaticPage({navigation, route}) {
  const onLinkCallback = url => {
    if (url.includes('@')) {
      // console.log('is an email');
      Linking.openURL(url);
      const isErrorResult = false;
      return new Promise((resolve, reject) => {
        isErrorResult ? reject() : resolve();
      });
    } else {
      // console.log('is a link');
      Linking.openURL(url);
      const isErrorResult = false;
      return new Promise((resolve, reject) => {
        isErrorResult ? reject() : resolve();
      });
    }
  };
  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={{flex: 1}}>
        <NavBar navigation={navigation} showBack={false} />
        <Header title={route.params.title} />
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
          }}>
          <View style={styles.bodyCont}>
            <View style={styles.articleCont}>
              <Markdown
                styles={markdownStyle.collectiveMd}
                onLink={url => onLinkCallback(url)}>
                {route.params.content}
              </Markdown>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const markdownStyle = {
  collectiveMd: {
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
    image: {display: 'none'},
    list: {color: '#222222'},
    listItemText: {color: '#222222'},
    listItemNumber: {lineHeight: 20},

    autolink: {
      color: '#222222',
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: 20,
    },
    text: {
      color: '#222222',
      fontSize: 16,
      lineHeight: 20,
      marginBottom: 20,
    },
    strong: {
      fontWeight: 'bold',
    },
    em: {
      fontStlye: 'italic',
    },
    // blockQuoteSection: {
    //   flexDirection: 'row',
    // },
    // blockQuoteSectionBar: {
    //   width: 0,
    //   height: null,
    //   backgroundColor: '#DDDDDD',
    //   marginRight: 15,
    // },
  },
};
