import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// NPM
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import ImagePicker from 'react-native-image-crop-picker';
// CUSTOM
import BestPracticeScreen from './BestPracticeScreen';
import Header from '../Components/Header';
import NavBar from '../Components/NavBar';
import styles from '../Styles/CBAB.module';
import headingImg from '../assets/headingBestBG.png';
import uploadIcon from '../assets/upload.png';
import cameraIcon from '../assets/camera.png';
//import RNFetchBlob from "rn-fetch-blob";
//var RNFS = require('react-native-fs');

const contentful = require('contentful-management');

const client = contentful.createClient({
  // This is the access token for this space. Normally you get the token in the Contentful web app
  accessToken:
    'CFPAT-2dc60a52d7b105efa085cf26e135d55479f74b17bdff7b63b24bb029e392fa67',
});

export default function UploadBestPracticeScreen({navigation}) {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessUnitValue, setBusinessUnitValue] = useState(null);
  const [toolsValue, setToolsValue] = useState(null);
  const [detailValue, setDetailValue] = useState(null);
  const [buData, setBuData] = useState([]);
  const [toolsData, setToolsData] = useState([]);
  const [detailsData, setDetailsData] = useState([]);
  const [image, setImage] = useState('/assets/camera.jpg');

  const [readFile, setReadFile] = useState(null);

  const [imageType, setImageType] = useState('');

  const getBusinessUnits = () => {
    axios({
      method: 'get',
      url: 'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50&content_type=buType',
    }).then(response => {
      setBuData(response.data.items);
    });
  };

  const getTools = () => {
    axios({
      method: 'get',
      url: 'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50&content_type=toolsType',
    }).then(response => {
      setToolsData(response.data.items);
    });
  };

  const getDetails = () => {
    axios({
      method: 'get',
      url: 'https://cdn.contentful.com/spaces/kst95g92kfwh/environments/master/entries?access_token=1833b658c22f833fc1c5b37e52ce3dd31eb8a25ef1d1094154346499ad566e50&content_type=detailsType',
    }).then(response => {
      setDetailsData(response.data.items);
    });
  };

  useEffect(() => {
    getBusinessUnits();
    getTools();
    getDetails();
  }, []);

  const [path, setPath] = useState('');
  const [filename, setFilename] = useState('');
  const [contentType, setContentType] = useState('');


  const handleSubmit = () => {
    // console.log('submit');
    // console.log('Description:' + description);
    // console.log('Name:' + name);
    // console.log('Title:' + title);
    // console.log('Email:' + email);
    // console.log('BU:' + businessUnitValue);
    // console.log('Tool:' + toolsValue);
    // console.log('Detail:' + detailValue);
    console.log(image);

    if (imageType == 'camera'){
      setPath(image.url);
      setFilename(image.name);
      setContentType(image.type);
    } else {
      setPath(image.sourceURL);
      setFilename(image.filename);
      setContentType(image.mime);
    }

    console.log(path)

   // uploadImage(path, filename, contentType);
  };

  const fromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      includeBase64: 'false',
      cropping: true,
    }).then(image => {
      // console.log(image);
      setImage(image);
      setImageType('library');
    });
  };

  const fromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      includeBase64: 'false',
      cropping: true,
    }).then(image => {
    //  console.log(image);
      setImage(image);
      setImageType('camera');
    });
  };

  const fetchResourceFromURI = async uri => {
    const response = await fetch(uri);
    console.log(response);
    const blob = await response.blob();
    return blob;
  };

  const uploadImage = async (path, filename, contentType) => {
    const img = await fetchResourceFromURI(path);
    // Create asset
    client
      .getSpace('kst95g92kfwh')
      .then(space => space.getEnvironment('master'))
      .then(environment =>
        environment
          .createUpload({
            file: img,
            contentType: contentType,
            fileName: filename,
          })
          .then(upload => {
            return environment.createAsset({
              sys: {
                contentType: {
                  sys: {
                    type: 'Link',
                    linkType: 'ContentType',
                    id: upload.sys.id,
                  },
                },
              },
              fields: {
                title: {
                  'en-US': filename,
                },
                file: {
                  'en-US': {
                    fileName: filename,
                    contentType: contentType,
                    uploadFrom: {
                      sys: {
                        type: 'Link',
                        linkType: 'Upload',
                        id: upload.sys.id,
                      },
                    },
                  },
                },
              },
            });
          }),
      )
      .then(asset => asset.processForAllLocales())
      .then(asset => asset.publish())
      .then(asset => {
        client
          .getSpace('kst95g92kfwh')
          .then(sp => sp.getEnvironment('master'))
          .then(env => {
            const entry = {
              fields: {
                photo: {
                  'en-US': {
                    sys: {
                      id: asset.sys.id,
                      linkType: 'Asset',
                      type: 'Link',
                    },
                  },
                },
                title: {
                  'en-US': title,
                },
                author: {
                  'en-US': name,
                },
                authorEmail: {
                  'en-US': email,
                },
                comments: {
                  'en-US': description,
                },
              },
            };
            if (businessUnitValue) {
              entry.fields.businessUnit = {
                'en-US': {
                  sys: {
                    id: businessUnitValue,
                    type: 'Link',
                    linkType: 'Entry',
                  },
                },
              };
            }
            if (toolsValue) {
              entry.fields.toolsType = {
                'en-US': {
                  sys: {
                    id: toolsValue,
                    type: 'Link',
                    linkType: 'Entry',
                  },
                },
              };
            }
            if (detailValue) {
              entry.fields.detailType = {
                'en-US': {
                  sys: {
                    id: detailValue,
                    type: 'Link',
                    linkType: 'Entry',
                  },
                },
              };
            }
            env
              .createEntry('bestPractice', entry)
              .then(entry => entry.publish())
              .then(entry => console.log(entry))
              .catch(console.error);
          })
          .catch(console.error);
      })
      .catch(console.error);

    navigation.navigate('BestPracticeScreen');
  };

  const handlePictureOption = () => {
    Alert.alert('Choose source', '', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Camera', onPress: () => fromCamera()},
      {text: 'Library', onPress: () => fromLibrary()},
    ]);
  };

  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={{flex: 1}}>
        <NavBar navigation={navigation} showBack={false} />
        <Header title="Upload your best practice" image="orange" />
        <ScrollView style={{flex: 1}}>
          <View style={[styles.bodyCont, {backgroundColor: '#ffffff'}]}>
            <View
              style={[
                styles.uploadInputField,
                {flexDirection: 'row', paddingBottom: 0},
              ]}>
              <TouchableOpacity
                style={
                  image == '/assets/camera.jpg'
                    ? styles.defaultUploadImgCont
                    : styles.uploadImgCont
                }
                onPress={handlePictureOption}>
                <Image
                  source={
                    image == '/assets/camera.jpg'
                      ? cameraIcon
                      : {uri: image.sourceURL}
                  }
                  resizeMode={
                    image == '/assets/camera.jpg' ? 'contain' : 'cover'
                  }
                  style={
                    image == '/assets/camera.jpg'
                      ? styles.defaultUploadImg
                      : styles.uploadImg
                  }
                />
              </TouchableOpacity>
              <TextInput
                style={[styles.uploadDescription, {flex: 1}]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add description"
                multiline={true}
              />
            </View>
            <View style={styles.uploadInputField}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                value={name}
                style={styles.textInput}
                onChangeText={setName}
                placeholder="Enter name"
              />
            </View>
            <View style={styles.uploadInputField}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                value={title}
                style={styles.textInput}
                onChangeText={setTitle}
                placeholder="Enter title"
              />
            </View>
            <View style={styles.uploadInputField}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={email}
                style={styles.textInput}
                onChangeText={setEmail}
                placeholder="Enter email"
              />
            </View>
            <View style={styles.uploadInputField}>
              <Text style={styles.inputLabel}>Business Unit</Text>
              <Dropdown
                data={buData}
                style={styles.dropdown}
                labelField="fields.title"
                valueField="sys.id"
                placeholder={'Select a business unit'}
                placeholderStyle={styles.dropDownPlaceholder}
                value={businessUnitValue}
                onChange={item => {
                  console.log(item.fields.title);
                  setBusinessUnitValue(item.sys.id);
                }}
              />
            </View>
            <View style={styles.uploadInputField}>
              <Text style={styles.inputLabel}>Tools</Text>
              <Dropdown
                data={toolsData}
                style={styles.dropdown}
                dropdownPosition="top"
                placeholder={'Select a tool'}
                placeholderStyle={styles.dropDownPlaceholder}
                labelField="fields.title"
                valueField="sys.id"
                value={toolsValue}
                onChange={item => {
                  setToolsValue(item.sys.id);
                }}
              />
            </View>
            <View style={styles.uploadInputField}>
              <Text style={styles.inputLabel}>Detail</Text>
              <Dropdown
                data={detailsData}
                style={styles.dropdown}
                dropdownPosition="top"
                placeholder={'Select detail type'}
                placeholderStyle={styles.dropDownPlaceholder}
                labelField="fields.title"
                valueField="sys.id"
                value={detailValue}
                onChange={item => {
                  setDetailValue(item.sys.id);
                }}
              />
            </View>
            <TouchableOpacity onPress={handleSubmit}>
              <ImageBackground
                source={headingImg}
                resizeMode="cover"
                style={[styles.uploadSubmitCont, styles.justifyCenter]}>
                <Text style={styles.headerTitle}>Upload</Text>
                <Image
                  source={uploadIcon}
                  resizeMode="contain"
                  style={styles.uploadIcon}
                />
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
