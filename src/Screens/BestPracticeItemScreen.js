import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// NPM
import axios from 'axios';
// CUSTOM
import NavBar from '../Components/NavBar';
import TitleValue from '../Components/TitleValue';
import styles from '../Styles/CBAB.module';

export default function BestPracticeItemScreen({navigation, route}) {
  const [currentItem, setCurrentItem] = useState(route.params.item);
  const [imgLink, setImgLink] = useState();
  const [businessUnit, setBusinessUnit] = useState();
  const [toolsType, setToolsType] = useState();
  const [detailsType, setDetailsType] = useState();

  const getPhoto = photo => {
    if (typeof photo !== 'undefined') {
      axios({
        method: 'get',
        url:
          'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/assets/' +
          currentItem.fields.photo.sys.id +
          '?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50',
      }).then(response => {
        setImgLink(response.data.fields.file.url);
      });
    }
  };

  const getBU = bu => {
    if (typeof bu !== 'undefined') {
      axios({
        method: 'get',
        url:
          'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries/' +
          currentItem.fields.businessUnit.sys.id +
          '?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50',
      }).then(response => {
        setBusinessUnit(response.data.fields.title);
        console.log(response.data.fields.title);
      });
    }
  };

  const getTools = tools => {
    if (typeof tools !== 'undefined') {
      axios({
        method: 'get',
        url:
          'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries/' +
          currentItem.fields.toolsType.sys.id +
          '?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50',
      }).then(response => {
        setToolsType(response.data.fields.title);
      });
    }
  };
  const getDetails = details => {
    if (typeof details !== 'undefined') {
      axios({
        method: 'get',
        url:
          'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries/' +
          currentItem.fields.detailType.sys.id +
          '?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50',
      }).then(response => {
        setDetailsType(response.data.fields.title);
      });
    }
  };

  const handleEmail = () => {
    Linking.openURL('mailto:' + currentItem.fields.authorEmail);
  };

  useEffect(() => {
    getPhoto(currentItem.fields.photo);
    getBU(currentItem.fields.businessUnit);
    getTools(currentItem.fields.toolsType);
    getDetails(currentItem.fields.detailType);
  }, []);

  const toggleBurger = () => {
    setIsBurgerVisable(!isBurgerVisable);
  };

  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={{flex: 1}}>
        <NavBar navigation={navigation} showBack={true} />
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
          }}>
          <Image
            source={{uri: 'https:' + imgLink}}
            style={styles.articleImage}
            resizeMode="cover"
          />
          <View style={styles.bodyCont}>
            <Text style={[styles.articleCont, styles.articleHeading]}>
              {currentItem.fields.title} by {currentItem.fields.author}
            </Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.bodyCont}>
            <View style={styles.articleCont}>
              <Text style={{marginBottom: 15}}>
                {currentItem.fields.comments}
              </Text>
              <View style={{marginBottom: 15}}>
                <TitleValue title="Business Unit" value={businessUnit} />
                <TitleValue title="Tools" value={toolsType} />
                <TitleValue title="Detail" value={detailsType} />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text>Contact uploader: </Text>
                <TouchableOpacity activeOpacity={0.5} onPress={handleEmail}>
                  <Text>{currentItem.fields.authorEmail}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
