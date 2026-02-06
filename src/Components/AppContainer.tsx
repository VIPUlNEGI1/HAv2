import React, {memo} from 'react'
import {ScrollView, StatusBar, type StyleProp, StyleSheet, View, type ViewStyle} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {Colors} from '@/Theme'

type AppContainerProps = {
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
  isSafeArea?: boolean
  paddingHorizontal?: number
  removeTopInset?: boolean
}

export default memo(
  ({
    children,
    isSafeArea = true,
    style = {},
    paddingHorizontal = 0,
    removeTopInset = true
  }: AppContainerProps) => {
    const {bottom, top} = useSafeAreaInsets()

    return (
      // <ScrollView> 
      <View
        style={[
          styles.container,
          {paddingHorizontal},
          isSafeArea && {
            paddingTop: removeTopInset ? 0 : top,
            // paddingBottom: bottom
          },
          style
        ]}
      >
        <StatusBar animated backgroundColor={'transparent'} barStyle={'dark-content'} />
        {children}
      </View>
      // </ScrollView>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1
  }
})
