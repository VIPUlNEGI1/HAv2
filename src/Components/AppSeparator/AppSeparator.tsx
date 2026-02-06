import React, {memo} from 'react'
import {StyleSheet, View} from 'react-native'
import { verticalScale } from '@/Helpers/Responsive'
export default memo(({size = 1}: {size?: number}) => {
  return <View style={[styles.container, {height: verticalScale(size)}]} />
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  }
})
