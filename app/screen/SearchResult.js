import React, { useState, useEffect, useRef } from 'react';
import { Video, AVPlaybackStatus } from 'expo-av';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'

function SearchResult({ route, navigation }) {
  const { item, otherParam } = route.params
  const filter_instances = item.instances.filter(video => video.url.indexOf(".mp4") != -1);
  const [isReady, setReady] = useState(false)
  const [visible, setVisible] = useState(false)
  const [video, setVideo] = useState(filter_instances[0].url)

  const goBack = () => {
    if(!navigation.canGoBack()) {
        return null;
    }
    return navigation.goBack()
  }

  useEffect(() => {
    // Do something with the selected video when it changes
    
    setVideo(filter_instances[0].url)
    setReady(true)
    // You can perform any actions related to the video change here
  }, [item]);
  
  return (
    <>
    {
      (<View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => goBack()}>
            <Ionicons name="ios-arrow-back-sharp" size={36} color="gray" />
          </TouchableOpacity>
          <View style={styles.dropdownsRow}>
            <SelectDropdown
              data={filter_instances}
              onSelect={(selectedItem, index) => {
                setVideo(selectedItem.url)
              }}  
              defaultButtonText={filter_instances[0].source}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.source;
              }}
              rowTextForSelection={(item, index) => {
                return item.source;
              }}
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
            />
          </View>
        </View>
        {video && <Video
            key={video.url}
            style={styles.videoStyle}
            onLoadStart={() => setReady(true)}
            source={{
              uri: video
            }}
            useNativeControls
            onReadyForDisplay={() => setReady(false)}
            resizeMode="contain"
        />}
        </View>
      )}
      </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 24,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    padding: 16,
    alignItems: "center",
    justifyContent: 'space-between'
  },
  videoStyle: {
    marginTop: 16,
    width: '100%',
    height: 250,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
  saveAreaViewContainer: {flex: 1, backgroundColor: '#FFF'},
  viewContainer: {flex: 1, backgroundColor: '#FFF'},
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '10%',
  },
  dropdownsRow: {flexDirection: 'row', width: '50%'},

  dropdown1BtnStyle: {
    flex: 1,
    height: 36,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  divider: {width: 12},
  dropdown2BtnStyle: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown2BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown2DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown2RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown2RowTxtStyle: {color: '#444', textAlign: 'left'},
});


export default SearchResult