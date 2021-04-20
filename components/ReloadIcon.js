import React from 'react'
import { View, Text, Platform, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'; 
import { colors } from '../utils/index';

export default function ReloadIcon({ load }) {
  const ReloadIconName = Platform.OS === 'ios' ? 'ios-refresh' : 'md-refresh'
  return (
    <View style={styles.reloadIcon} >
      <Ionicons onPress={load} name={ReloadIconName} size={24} color={colors.PRIMARY_COLOR} />
    </View>
  )
}


const styles = StyleSheet.create({
  reloadIcon: {
    position: 'absolute',
    top: 150, 
    right: 20,
    left: 30
  }
})
