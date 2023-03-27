import {Image, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
// NPM
// CUSTOM
import BurgerMenu from '../Screens/BurgerMenu';
import styles from '../Styles/CBAB.module';
import logo from '../assets/logoBlock.jpg';
import backArrow from '../assets/arrow-left.png';

export default function NavBar({navigation, showBack, toggleBurger}) {
  const [isBurgerVisable, setIsBurgerVisable] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleBurger = () => {
    setIsBurgerVisable(!isBurgerVisable);
  };

  const goHome = () => {
    navigation.navigate('HomeScreen');
  };
  return (
    <View>
      <View style={styles.navContainer}>
        <View style={[styles.justifyCenter, {alignItems: 'flex-start'}]}>
          {showBack ? (
            <TouchableOpacity
              onPress={handleBack}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <Image
                source={backArrow}
                style={{width: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={[styles.justifyCenter, {alignItems: 'center'}]}>
          <TouchableOpacity onPress={goHome} style={{width: '100%'}}>
            <Image
              source={logo}
              style={{width: '100%'}}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.justifyCenter, {alignItems: 'flex-end'}]}>
          <TouchableOpacity onPress={handleBurger}>
            <View style={styles.burgerLine} />
            <View style={styles.burgerLine} />
            <View style={styles.burgerLine} />
          </TouchableOpacity>
        </View>
      </View>
      <BurgerMenu
        navigation={navigation}
        isBurgerVisable={isBurgerVisable}
        setIsBurgerVisable={setIsBurgerVisable}
      />
    </View>
  );
}
