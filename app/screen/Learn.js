import React from 'react'
import { StyleSheet, Text, View, StatusBar, ScrollView, SafeAreaView, TouchableOpacity, Button } from 'react-native';
import Category from '../components/Category.js'

function Learn( { navigation } ) { 
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor='#fff' />
        <Category navigation={navigation}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 36,
    },
    headerContainer: {
        display: 'flex',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 12,
        paddingTop: 10
    },
    headerText: {
        fontFamily: "Poppins",
        fontSize: 20
    },
    scrollContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default Learn