import {
  ActivityIndicator,
  Image,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// NPM
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
// CUSTOM
import BestPracticeLinkItem from '../Components/BestPracticeLinkItem';
import Filter from '../Components/Filter';
import Header from '../Components/Header';
import NavBar from '../Components/NavBar';
import styles from '../Styles/CBAB.module';
import cameraIcon from '../assets/camera.png';
import headingImg from '../assets/headingBestBG.png';

export default function BestPracticeScreen({navigation}) {
  const [isFilterVisible, setIsFilterVisable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState();
  const [bestPractices, setBestPractices] = useState([]);

  const [selectedBUFilter, setSelectedBUFilter] = useState([]);
  const [selectedToolsFilter, setSelectedToolsFilter] = useState([]);
  const [selectedDetailsFilter, setSelectedDetailsFilter] = useState([]);

  const sortByData = [
    {label: 'Title', value: 'title'},
    {label: 'Sort by Ascending', value: 'date-asc'},
    {label: 'Sort by Descending', value: 'date-desc'},
  ];

  useEffect(() => {
    axios({
      method: 'get',
      url: 'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50&content_type=bestPractice',
    }).then(response => {
      setBestPractices(response.data.items);
      console.log(response.data.items[1]);
      setIsLoading(false);
    });
  }, [selectedBUFilter, selectedToolsFilter, selectedDetailsFilter]);

  const runFilter = () => {
    var filteredArray = bestPractices.filter(bestPractice => {
      return !(
        (selectedBUFilter.length &&
          bestPractice.fields.businessUnit !== undefined &&
          selectedBUFilter.indexOf(bestPractice.fields.businessUnit.sys.id) <
            0) ||
        (selectedToolsFilter.length &&
          bestPractice.fields.toolsType !== undefined &&
          selectedToolsFilter.indexOf(bestPractice.fields.toolsType.sys.id) <
            0) ||
        (selectedDetailsFilter.length &&
          bestPractice.fields.detailType !== undefined &&
          selectedDetailsFilter.indexOf(bestPractice.fields.detailType.sys.id) <
            0)
      );
    });
    setBestPractices(filteredArray);
    setIsFilterVisable(false);
  };

  const resetFilter = () => {
    setSelectedBUFilter([]);
    setSelectedToolsFilter([]);
    setSelectedDetailsFilter([]);
  };

  const closeFilter = () => {
    setSelectedBUFilter([]);
    setSelectedToolsFilter([]);
    setSelectedDetailsFilter([]);
    setIsFilterVisable(false);
  };

  const sort = sortType => {
    if (sortType === 'date-asc') {
      var sorted = bestPractices.sort((a, b) => {
        return a.sys.createdAt.localeCompare(b.sys.createdAt);
      });
      setBestPractices(sorted);
    } else if (sortType === 'date-desc') {
      var sorted = bestPractices.sort((a, b) => {
        return b.sys.createdAt.localeCompare(a.sys.createdAt);
      });
      setBestPractices(sorted);
    } else {
      var sorted = bestPractices.sort((a, b) => {
        return a.fields.title.localeCompare(b.fields.title);
      });
      setBestPractices(sorted);
    }
  };

  const handlePress = () => {
    navigation.navigate('UploadBestPracticeScreen');
  };

  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={{flex: 1}}>
        <NavBar navigation={navigation} showBack={false} />
        <Header title="Sharing Best Practice" image="orange" />
        <View style={styles.sortByCont}>
          <View style={[styles.justifyCenter, styles.leftCol]}>
            <Dropdown
              data={sortByData}
              style={styles.sortFilterBtn}
              placeholder="Sort by ..."
              placeholderStyle={styles.sortFilterText}
              labelField="label"
              valueField="value"
              value={sortBy}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              onChange={item => {
                console.log(item.value);
                sort(item.value);
                setSortBy(item.value);
              }}
            />
          </View>
          <View style={[styles.justifyCenter, styles.rightCol]}>
            <TouchableOpacity
              style={
                isFilterVisible
                  ? [styles.sortFilterBtn, styles.active]
                  : styles.sortFilterBtn
              }
              activeOpacity={0.75}
              onPress={() => {
                setIsFilterVisable(!isFilterVisible);
              }}>
              <View>
                <Text
                  style={
                    isFilterVisible
                      ? [styles.sortFilterText, styles.active]
                      : styles.sortFilterText
                  }>
                  Filter...
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bpCont}>
          <ScrollView style={isFilterVisible ? {flex: 1} : {display: 'none'}}>
            <Filter
              selectedBUFilter={selectedBUFilter}
              selectedToolsFilter={selectedToolsFilter}
              selectedDetailsFilter={selectedDetailsFilter}
              setSelectedBUFilter={setSelectedBUFilter}
              setSelectedToolsFilter={setSelectedToolsFilter}
              setSelectedDetailsFilter={setSelectedDetailsFilter}
              runFilter={runFilter}
              resetFilter={resetFilter}
              closeFilter={closeFilter}
            />
          </ScrollView>
          <View style={!isFilterVisible ? {flex: 1} : {display: 'none'}}>
            <View style={[styles.bodyCont, {backgroundColor: '#ffffff'}]}>
              <FlatList
                data={bestPractices}
                horizontal={false}
                numColumns={2}
                renderItem={({item, index}) => (
                  <View style={{flex: 1}}>
                    <BestPracticeLinkItem
                      item={item}
                      index={index}
                      navigation={navigation}
                    />
                  </View>
                )}
              />
              <View
                style={isLoading ? styles.loadingContainer : {display: 'none'}}>
                <ActivityIndicator
                  animating={isLoading}
                  size="large"
                  color="#000000"
                />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bpFooterCont}
          onPress={handlePress}
          activeOpacity={0.5}>
          <Text style={styles.bpFooterText}>Upload your best practice</Text>
          <Image source={cameraIcon} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
