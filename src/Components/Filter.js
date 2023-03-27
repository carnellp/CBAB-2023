import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';

import axios from 'axios';
import {MultiSelect} from 'react-native-element-dropdown';
import styles from '../Styles/CBAB.module';
import btnBackground from '../assets/headingBestBG.png';

export default function Filter({
  selectedBUFilter,
  selectedToolsFilter,
  selectedDetailsFilter,
  setSelectedBUFilter,
  setSelectedToolsFilter,
  setSelectedDetailsFilter,
  runFilter,
  resetFilter,
  closeFilter,
}) {
  const [buTypes, setBUTypes] = useState([]);
  const [toolTypes, setToolTypes] = useState([]);
  const [detailTypes, setDetailTypes] = useState([]);

  const getBUTypes = () => {
    axios({
      method: 'get',
      url: 'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50&content_type=buType',
    }).then(response => {
      const tempArray = [];
      response.data.items.map(item => {
        tempArray.push({label: item.fields.title, value: item.sys.id});
      });
      setBUTypes(tempArray);
    });
  };

  const getToolTypes = () => {
    axios({
      method: 'get',
      url: 'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50&content_type=toolsType',
    }).then(response => {
      const tempArray = [];
      response.data.items.map(item => {
        tempArray.push({label: item.fields.title, value: item.sys.id});
      });
      setToolTypes(tempArray);
    });
  };
  const getDetailTypes = () => {
    axios({
      method: 'get',
      url: 'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50&content_type=detailsType',
    }).then(response => {
      const tempArray = [];
      response.data.items.map(item => {
        tempArray.push({label: item.fields.title, value: item.sys.id});
      });
      setDetailTypes(tempArray);
    });
  };

  useEffect(() => {
    getBUTypes();
    getToolTypes();
    getDetailTypes();
  }, []);

  return (
    <View style={styles.filterCont}>
      <MultiSelect
        data={buTypes}
        labelField="label"
        valueField="value"
        placeholder="Select business unit"
        value={selectedBUFilter}
        style={styles.filterDropdown}
        onChange={item => {
          setSelectedBUFilter(item);
        }}
      />
      <MultiSelect
        data={toolTypes}
        labelField="label"
        valueField="value"
        placeholder="Select tools"
        value={selectedToolsFilter}
        style={styles.filterDropdown}
        onChange={item => {
          setSelectedToolsFilter(item);
        }}
      />
      <MultiSelect
        data={detailTypes}
        labelField="label"
        valueField="value"
        placeholder="Select details"
        value={selectedDetailsFilter}
        style={styles.filterDropdown}
        onChange={item => {
          setSelectedDetailsFilter(item);
        }}
      />
      <View style={styles.filterBtnRow}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={closeFilter}
          style={[styles.leftCol, {flex: 1}]}>
          <ImageBackground source={btnBackground} style={styles.filterBtn}>
            <Text style={styles.filterBtnText}>Close</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={resetFilter}
          style={[styles.leftCol, styles.rightCol, {flex: 1}]}>
          <ImageBackground source={btnBackground} style={styles.filterBtn}>
            <Text style={styles.filterBtnText}>Reset</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={runFilter}
          style={[styles.rightCol, {flex: 1}]}>
          <ImageBackground source={btnBackground} style={styles.filterBtn}>
            <Text style={styles.filterBtnText}>Run Filter</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
}
