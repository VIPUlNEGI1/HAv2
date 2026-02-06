import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { Colors } from '@/Theme';

export const AppLoader = React.forwardRef((props, ref) => {
  const [visible, setVisible] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
    hide: () => setVisible(false),
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    </Modal>
  );
});

export const Loader = {
  loaderRef: null as any,
  setLoader: (ref: any) => {
    Loader.loaderRef = ref;
  },
  show: () => Loader.loaderRef?.show(),
  hide: () => Loader.loaderRef?.hide(),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});
