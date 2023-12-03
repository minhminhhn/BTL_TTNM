import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Platform, Image, TouchableOpacity, ActivityIndicator, Modal, TextInput, Keyboard } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { fetch, decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Octicons } from '@expo/vector-icons'; 

const textureDims = Platform.OS === 'ios' ?
  {
    height: 1920,
    width: 1080,
  } :
   {
    height: 1920,
    width: 1080,
  };

let frame = 0;
const computeRecognitionEveryNFrames = 60;

const TensorCamera = cameraWithTensors(Camera);

const initialiseTensorflow = async () => {
  await tf.ready();
  tf.getBackend();
}
const convertIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", 
                      "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
                      "Y", "Z", "Nothing", "Space"]

export default function Recognition( {navigation} ) {
  const [sentence, setSentence] = useState('')
  const [hasPermission, setHasPermission] = useState(null)
  const [detections, setDetections] = useState([])
  const [net, setNet] = useState(null);
  const [toggleCam, setToggleCam] = useState(true)
  const [sentenceModalVisible, setSentenceModalVisible] = useState(false)
  const [camModalVisible, setCamModalVisible] = useState(false)
  const [cameraType, setCameraStyle] = useState(Camera.Constants.Type.back)

  const toggleCamera = () => {
    setToggleCam(!toggleCam)
    if (toggleCam) {
      setCamModalVisible(true)
    }
  }

  const changeCameraType = () => {
    if (cameraType == Camera.Constants.Type.back) {
      setCameraStyle(Camera.Constants.Type.front)
    } else {
      setCameraStyle(Camera.Constants.Type.back)
    }
  }

  const chooseLetter = (letter) => {
    let newSentence = sentence
    if (letter === 'Space') {
      newSentence = sentence + ' '
    } else if (letter === 'Nothing') {
      newSentence = sentence + ''
    } else {
      newSentence = sentence + letter
    }
    setSentence(newSentence)
    setCamModalVisible(false)
    setToggleCam(!toggleCam)
  }

  const openSentenceModal = () => {
    setSentenceModalVisible(true)
    setCamModalVisible(false)
    setToggleCam(false)
  }

  const closeSentenceModal = () => {
    setSentenceModalVisible(false)
    setCamModalVisible(false)
    setToggleCam(true)
  }

  const handleCameraStream = (images) => {
    const loop = async () => {
      if(net) {
        if(frame % computeRecognitionEveryNFrames === 0){
          const max = tf.scalar(255)
          let nextImageTensor = images.next().value
          if(nextImageTensor){
            nextImageTensor = tf.cast(nextImageTensor, 'float32')
            nextImageTensor = nextImageTensor.div(max)
            nextImageTensor = nextImageTensor.reshape([1, 224, 224, 3])
            const prediction = await net.predict(nextImageTensor).data();
            const clone = [...prediction]
            const result = Array.prototype.slice.call(clone.sort((a, b) => b - a).slice(0, 3))
            const detect = result.map(r => ({
              "id": convertIndex[prediction.indexOf(r)],
              "prob": r * 100
            }))
            setDetections(detect)
            tf.dispose([nextImageTensor]);
          }
        }
        frame += 1;
        frame = frame % computeRecognitionEveryNFrames;
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      await initialiseTensorflow();
      const modelJson = require("../model/model.json");
      const modelWeight = require("../model/group1-shard1of1.bin");
      const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeight));
      setNet(model)
      // await initialiseTensorflow()
      // const modelJson = require("../model/model.json");
      // const modelWeight = require("../model/group1-shard1of1.bin");
      // const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeight));


      // const image = require('../assets/images/A1.jpeg');
      // const imageAssetPath = Image.resolveAssetSource(image);
      // const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
      // const imageDataArrayBuffer = await response.arrayBuffer();
      // const imageData = new Uint8Array(imageDataArrayBuffer);

      // // Decode image data to a tensor
      // const max = tf.scalar(255)
      // const imageCast = tf.cast(decodeJpeg(imageData), 'float32')
      // const imageCastDiv = imageCast.div(max)
      // imageCastDiv.print()
      // const imageTensor = imageCastDiv.reshape([1, 224, 224, 3]);

      // const prediction = await model.predict(imageTensor).data()
      // console.log(prediction)

    })();
  }, []);

  const resetState = () => {
    setSentence('')
    setDetections([])
    setToggleCam(true)
    setCamModalVisible(false)
    setSentenceModalVisible(false)
  }
  const goBack = () => {
    if(!navigation.canGoBack()) {
        return null;
    }
    resetState()
    return navigation.goBack()
  }

  if (hasPermission === null) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <Text>Turn on your camera permission</Text>
      </View>
    )
  }
  if (hasPermission === false) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <Text>Turn on your camera permission</Text>
      </View>
    )
  }
  if(!net){
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color="#2596be" />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => goBack()}
        >
          <Ionicons name="ios-arrow-back-sharp" size={36} color="#2596be" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeCameraType()}
        >
          <Ionicons name="md-camera-reverse" size={36} color="#2596be" />
        </TouchableOpacity>
      </View>
      <View style={styles.cameraContainer}>
        {toggleCam && 
        <TensorCamera 
          style={styles.camera} 
          onReady={handleCameraStream}
          type={cameraType}
          cameraTextureHeight={textureDims.height}
          cameraTextureWidth={textureDims.width}
          resizeHeight={224}
          resizeWidth={224}
          resizeDepth={3}
          autorender={true}
        />
      }
        <View style={{
          position: 'absolute',
          alignItems: 'center',
          left: 0,
          right: -260,
          top: 10,
          zIndex: 10
        }}>
          {detections.map((detection, index) => (
            <View key={index}>
              <Text 
                style={{
                  fontSize: 16,
                  color: 'white',
                  fontFamily: 'Poppins',
                }}>
                {detection.id} - {Math.round(detection.prob * 100) / 100}%
              </Text>
            </View>
          ))}
        </View>
        <View style={{
          position: 'absolute',
          alignItems: 'center',
          left: 0,
          right: 0,
          bottom: 16,
          zIndex: 10,
        }}>
          <TouchableOpacity style={styles.cameraButton} onPress={() => toggleCamera()}>
            <Octicons name="device-camera" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.predictionContainer}>
        <TouchableOpacity 
          onPress={() => {openSentenceModal()}}
          style={{
            borderWidth: 1,
            borderColor: '#2596be',
            padding: 16, borderRadius: 16,
          }}>
            <Text style={{ textAlign: 'center', color: '#2596be', fontSize: 16}}>View Sentence</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate("TTS", {text: sentence})}
          style={{
            backgroundColor: '#2596be',
            padding: 16, borderRadius: 16
          }}>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16}}>Finish Sentence</Text>
        </TouchableOpacity>
      </View>
      <Modal 
        animationType="slide"
        transparent={true}
        visible={sentenceModalVisible}
        onRequestClose={() => {
          setSentenceModalVisible(!sentenceModalVisible);
        }}
      >
        <View style={ {flex: 1, justifyContent: 'center', alignItems: 'center',} }>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Your Current Sentence</Text>
            <TextInput
              multiline={true}
              numberOfLines={5}
              style={styles.input}
              onChangeText={(sentence) => setSentence(sentence)}
              value={sentence}
              onSubmitEditing={Keyboard.dismiss}
            />
            <View style={styles.sentenceButtons}>
              <TouchableOpacity 
                onPress={() => {closeSentenceModal()}}
                style={{
                  borderWidth: 1,
                  borderColor: '#2596be',
                  padding: 8, borderRadius: 8,
                }}>
                  <Text style={{ textAlign: 'center', color: '#2596be', fontSize: 12}}>Close Modal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  setCamModalVisible(!camModalVisible)
                  return navigation.navigate("TTS", {text: sentence})
                }}
                style={{
                  backgroundColor: '#2596be',
                  padding: 8, borderRadius: 8
                }}>
                  <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12}}>Finish Sentence</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal 
        animationType="slide"
        transparent={true}
        visible={camModalVisible}
        onRequestClose={() => {
          setToggleCam(!toggleCam)
          setCamModalVisible(!camModalVisible)
        }}
      >
        <View style={ {flex: 1, justifyContent: 'center', alignItems: 'center',} }>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Choose One Of The Letters Predicted</Text>
              {detections.length != 0 && detections.map((detection, index) => {
                const length = `${Math.round(detection.prob * 100) / 100}%`
                return (
                <TouchableOpacity style={styles.letterOption} key={index} onPress={() => chooseLetter(detection.id)}>
                  <Text>{detection.id}</Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={{
                        height: 16,
                        borderRadius: 16,
                        backgroundColor: '#30bdf0',
                        borderColor: '#2ba9d6',
                        borderWidth: 2,
                        width: length
                      }}>
                    </View>
                  </View>
                </TouchableOpacity>
              )})}
              <TouchableOpacity 
                onPress={() => {
                  setToggleCam(!toggleCam)
                  setCamModalVisible(!camModalVisible)
                }}
                style={{
                  borderWidth: 1,
                  borderColor: '#2596be',
                  padding: 8, borderRadius: 8,
                }}>
                  <Text style={{ textAlign: 'center', color: '#2596be', fontSize: 12}}>Close Modal</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: "center",
    paddingVertical: 16,
    zIndex: 1
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black'
  },
  camera: {
    flex: 1,
  },
  cameraButton: {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    aspectRatio: 1, 
    borderRadius: 35,
    backgroundColor: '#fff',
    width: 70,
    height: 70,
  },
  predictionContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  modalView: {
    width: '80%',
    borderRadius: 20,
    backgroundColor: "white",
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  progressBar: {
    width: '80%',
    height: 16,
    backgroundColor: '#f3f3f3',
    borderRadius: 16,
  },
  letterOption: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    marginVertical: 16
  },
  input: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%'
  },
  sentenceButtons: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%'
  }
});