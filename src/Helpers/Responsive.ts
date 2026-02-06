import {Dimensions, Platform, StatusBar} from 'react-native'
import {isTablet} from 'react-native-device-info'

const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} = Dimensions.get('window')
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('screen')

let isIPhoneX = false

if (Platform.OS === 'ios' && !Platform.isPad) {
  isIPhoneX =
    WINDOW_HEIGHT === 852 ||
    WINDOW_WIDTH === 852 ||
    WINDOW_HEIGHT === 932 ||
    WINDOW_WIDTH === 932 ||
    WINDOW_HEIGHT === 812 ||
    WINDOW_WIDTH === 812 ||
    WINDOW_HEIGHT === 844 ||
    WINDOW_WIDTH === 844 ||
    WINDOW_HEIGHT === 896 ||
    WINDOW_WIDTH === 896 ||
    WINDOW_HEIGHT === 926 ||
    WINDOW_WIDTH === 926
}

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const widthPx = (widthPercent: number) => {
  return (screenWidth * widthPercent) / 100
}

const heightPx = (heightPercent: number) => {
  return ((screenHeight - getStatusBarHeight()) * heightPercent) / 100
}

const font = (size: number) => {
  return (screenWidth * size) / 100
}

const getStatusBarHeight = () => {
  const statusBarHeight: number = Platform.select({
    ios: isIPhoneX ? 44 : 20,
    android: (StatusBar.currentHeight ?? 0) > 24 ? 0 : (StatusBar.currentHeight ?? 0),
    default: 0
  })
  return statusBarHeight
}

const isIPhoneXSeries = () => {
  if (Platform.OS === 'android') {
    return 0
  }
  return isIPhoneX ? 34 : 0
}

const isAndroidNouch = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) > 24 : false
const [shortDimension, longDimension] =
  WINDOW_WIDTH < WINDOW_HEIGHT ? [WINDOW_WIDTH, WINDOW_HEIGHT] : [WINDOW_HEIGHT, WINDOW_WIDTH]

// guideline size
const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

const scale = (size: number) => (shortDimension / guidelineBaseWidth) * size

const verticalScale = (size: number) => (longDimension / guidelineBaseHeight) * size

const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor

const isTab = isTablet()

export {
  font,
  getStatusBarHeight,
  heightPx,
  isAndroidNouch,
  isIPhoneX,
  isIPhoneXSeries,
  isTab,
  moderateScale,
  scale,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  verticalScale,
  widthPx
}
