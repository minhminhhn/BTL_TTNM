import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Modal, Animated, Dimensions, Image } from 'react-native'
import React , { useState, useRef, useEffect } from 'react'
import  QuizData  from '../data/QuizData'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme'
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video, AVPlaybackStatus } from 'expo-av';

const { height, width } = Dimensions.get("window")

const Quiz = ( {route, navigation} ) => {
  const item = route.params.item
  const flashcards = item.flashcards
  const [allQuestions, setAllQuestions] = useState([]);
  const scroll = useRef(null)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false)
  const [score, setScore] = useState(0);

  const [showNextButton, setShowNextButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const [progress, setProgress] = useState(new Animated.Value(0));
  const progessAnim = progress.interpolate({
    inputRange: [0, allQuestions.length],
    outputRange: ['0%', '100%']
  })

  const updateProgress = async (currentCourse, percentage) => {
    try {
      const updatedProgress = {
        ...currentCourse,
        progress: `${percentage}%`
      }
      const itemString = await AsyncStorage.getItem('Progress')
      const items = JSON.parse(itemString)
      const newItems = [...items]
      if (items != null) {
          const currentIndex = items.findIndex((item) => item.title === currentCourse.title)
          if (percentage < parseFloat(items[currentIndex].progress.replace('%',''))) {
            restartQuiz()
            return navigation.navigate("Learn")
          }
          newItems.splice(currentIndex, 1, updatedProgress)
          await AsyncStorage.setItem('Progress', JSON.stringify(newItems))
          restartQuiz()
          return navigation.navigate("Learn")
      }
    } catch (e) {
        console.log(e)
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setAllQuestions(QuizData(flashcards))
      setShowScoreModal(false)
      setCurrentQuestionIndex(0)
      setScore(0)
      setCurrentOptionSelected(null)
      setCorrectOption(null)
      setIsOptionDisabled(false)
      setShowNextButton(false)
      Animated.timing(progress, {
          toValue: 0,
          useNativeDriver: false
      }).start()
      scroll.current?.scrollTo({x: 0, animated: false})
    });
    return unsubscribe;
 }, [navigation, flashcards]);

  const validateAnswer = (selectedOption) => {
    let correct_option = allQuestions[currentQuestionIndex]['correct_option'];
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(correct_option);
    setIsOptionDisabled(true);
    if (selectedOption==correct_option) {
      setScore(score + 1)
    }
    setShowNextButton(true);
  }

  const handleNext = () => {
    if(currentQuestionIndex == allQuestions.length - 1){
      setShowScoreModal(true);
    } else {
      setCurrentOptionSelected(null);
      setCorrectOption(null);
      setIsOptionDisabled(false);
      setCurrentQuestionIndex(currentQuestionIndex+1);
      setShowNextButton(false);
      scroll.current?.scrollTo({x: width * (currentQuestionIndex + 1), animated: true})
    }
    Animated.timing(progress, {
      toValue: currentQuestionIndex+1,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }

  const restartQuiz = () => {
    setShowScoreModal(false)
    setCurrentQuestionIndex(0)
    setScore(0);
    setCurrentOptionSelected(null);
    setCorrectOption(null);
    setIsOptionDisabled(false);
    setShowNextButton(false);
    scroll.current?.scrollTo({x: 0, animated: true})
    Animated.timing(progress, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }

  const renderQuestion = ( currentQuestion ) => {
    return (
      <View style={{
        marginVertical: 16,
      }}>
        {/*Question*/}
        <Text style={styles.question.text}>{currentQuestion.question}</Text>
        <Video
          style={styles.videoStyle}
          source={{
            uri: currentQuestion.video
          }}
          useNativeControls
          resizeMode="contain"
          isLooping
          onError={(error) => console.error("Video playback error:", error)}
          androidImplementation="MediaPlayer"
        />
        {/* <Video
                        style={styles.videoStyle}
                        source={{
                          uri: flashcard.video
                        }}
                        useNativeControls
                        resizeMode="contain"
                        isLooping
                    /> */}
      </View>
    )
  }

  const renderOptions = ( currentQuestion, index ) => {
    const colorStyle = (option) => option==correctOption ? COLORS.success+'20'
    : option==currentOptionSelected ? COLORS.error+'20'
    : COLORS.white
    return (
      <View>
        {
          currentQuestion.options.map(option => {
            return(
            <TouchableOpacity
              onPress={() => validateAnswer(option)}
              disabled={isOptionDisabled}
              key={option + index}
              style={[styles.option.container, {
                borderColor: option==correctOption
                ? COLORS.success
                : option==currentOptionSelected
                ? COLORS.error
                : COLORS.secondary,
                backgroundColor: colorStyle(option),
              }]}
            >
              <Text style={styles.option.text}>{option}</Text>
              {
                option==correctOption ? (
                  <View style={styles.option.success}>
                    <AntDesign name="check" style={{color: "#fff", fontSize: 20}}/>
                  </View>
                ) : option == currentOptionSelected ? (
                    <View style={styles.option.error}>
                      <AntDesign name="close" style={{color: "#fff", fontSize: 20}}/>
                    </View>
                ) : null
              }
            </TouchableOpacity>
          )})
        }
      </View>
    )
  }

  const renderNextButton = () => {
    if(showNextButton){
      return (
        <TouchableOpacity 
          onPress={handleNext}
          style={styles.nextButton.container}
        >
          <Text style={styles.nextButton.text}>Next</Text>
        </TouchableOpacity>
      )
    } else {
      return null
    }
  }
  const renderProgressBar = () => {
    return (
      <View style={styles.progressBar}>
        <Animated.View 
          style={{
            height: 24,
            borderRadius: 24,
            backgroundColor: '#30bdf0',
            borderColor: '#2ba9d6',
            borderWidth: 5,
            width: progessAnim
          }}>
        </Animated.View>
      </View>
    )
  }

  const goBack = () => {
    if(!navigation.canGoBack()) {
        return null;
    }
    return navigation.goBack()
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => goBack()}
        >
          <Ionicons name="ios-arrow-back-sharp" size={36} color="#2596be" />
        </TouchableOpacity>
        {renderProgressBar()}
      </View>
      <ScrollView>
        <ScrollView
          ref={scroll}
          horizontal={true}
          pagingEnabled={true}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
        >
          {allQuestions.map((question, index) => {
            return (
            <View style={{width: width, paddingHorizontal: 16}} key={index}>
              {renderQuestion(question)}
              {console.log(question)}
              {renderOptions(question, index)}
            </View>
            )
          })}
        </ScrollView>
        <View style={{paddingHorizontal: 16}}>
          {renderNextButton()}
        </View>
      </ScrollView>
      <Modal
          animationType="slide"
          transparent={true}
          visible={showScoreModal}
        >
          <View style={{
            flex: 1,
            backgroundColor: '#fff',
          }}>
            <View style={{
              flex: 3,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}>
              <Text style={{fontSize: 30, fontFamily: 'Poppins', color: '#130b43', textAlign: 'center'}}>{ score > (allQuestions.length/2) ? 'Congratulations!' : 'Try Again'}</Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 20
              }}>
                <Text style={{
                  fontFamily: 'Montserrat', 
                  fontSize: 30,
                  textAlign: 'center',
                  color: score > (allQuestions.length/2) ? COLORS.success : COLORS.error
                }}>{score}</Text>
                <Text style={{
                  fontSize: 30, color: '#130b43',
                  fontFamily: 'Montserrat',
                  textAlign: 'center',
                }}>/ {allQuestions.length}</Text>
              </View>
              </View>
              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}>
              <TouchableOpacity 
                  onPress={restartQuiz}
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.accent,
                    padding: 16, width: '100%', borderRadius: 16,
                    marginBottom: 16
                }}>
                  <Text style={{ textAlign: 'center', color: COLORS.accent, fontSize: 20}}>Retry Quiz</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => updateProgress(item, (score / allQuestions.length) * 100)}
                  style={{
                    backgroundColor: COLORS.accent,
                    padding: 16, width: '100%', borderRadius: 16
                }}>
                  <Text style={{ textAlign: 'center', color: COLORS.white, fontSize: 20}}>Finish Quiz</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
  },
  headerBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 16
  },
  progressBar: {
    width: '85%',
    height: 24,
    backgroundColor: '#f3f3f3',
    borderRadius: 20,
  },
  question: {
    text: {
      color: '#171717',
      fontSize: 30,
    }
  },
  option: {
    container: {
      borderWidth: 2,
      height: 60, 
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginVertical: 10
    },
    text: {
      fontSize: 20,
      color: '#171717'
    },
    success: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#00C851',
      justifyContent: 'center',
      alignItems: 'center'
    },
    error: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#FF4444',
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  nextButton: {
    container: {
      marginTop: 24,
      width: '100%',
      backgroundColor: "#2596be",
      padding: 15,
      borderRadius: 15
    },
    text: {
      fontSize: 20,
      color: "#fff",
      textAlign: 'center'
    },
  },
  videoStyle: {
    marginTop: 16,
    width: '100%',
    height: 250,
  }
})

export default Quiz