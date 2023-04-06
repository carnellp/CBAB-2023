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
import {Buffer} from "buffer";
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
  const [image, setImage] = useState('/assets/camera.png');

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

  const handleSubmit = () => uploadImage();

  const fromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      includeBase64: true,
      cropping: true,
    }).then(async (image) => {
      setImage(image);
      setImageType('library');
    });
  };

  const fromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      includeBase64: true,
      cropping: true,
    }).then(image => {
      setImage(image);
      setImageType('camera');
    });
  };
  const uploadImage = async () => {
    const imageBuffer = Buffer.from(image.data, 'base64');
    const fileName = image.path.split("/").at(-1)
    const contentType = image.mime;

    const upload = await client.getSpace("kst95g92kfwh")
      .then((space) => space.getEnvironment('master'))
      .then((env) => env.createUpload({
          file: imageBuffer,
          contentType: contentType,
          fileName: fileName,
        })
      )
      .then((upload) => upload)

    await client.getSpace("kst95g92kfwh")
      .then((space) => space.getEnvironment('master'))
      .then((env) => {
        env.createAsset({
            fields: {
              title: {
                'en-US': title
              },
              file: {
                'en-US': {
                  fileName: fileName,
                  contentType: contentType,
                  uploadFrom: {
                    sys: {
                      type: 'Link',
                      linkType: 'Upload',
                      id: upload.sys.id
                    },
                  },
                },
              },
            },
          })
          .then((asset) => {
            return asset.processForAllLocales({processingCheckWait: 2000})
          })
          .then((asset) => {
            return asset.publish()
          })
          .then((asset) => {
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
      })
      .catch(console.error)

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
              style={[styles.uploadInputField, {flexDirection: 'row', paddingBottom: 0},]} >
              <TouchableOpacity 
              style={image == '/assets/camera.png' ? styles.defaultUploadImgCont : styles.uploadImgCont} onPress={handlePictureOption}>
                <Image
                  source={
                    image == '/assets/camera.png' ? cameraIcon : {uri: image.sourceURL}
                  }
                  resizeMode={
                   image == '/assets/camera.png' ? 'contain' : 'cover'
                  }
                  style={
                    image == '/assets/camera.png' ? styles.defaultUploadImg : styles.uploadImg
                  }
                />
              </TouchableOpacity>
              <TextInput style={[styles.uploadDescription, {flex: 1}]} value={description} onChangeText={setDescription} placeholder="Add description"                       multiline={true} />
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