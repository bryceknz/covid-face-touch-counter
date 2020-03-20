import React, { useState, useEffect } from 'react'
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Constants from 'expo-constants'

export default function App () {
  const [ count, setCount ] = useState()
  useEffect(loadCount)

  function loadCount () {
    AsyncStorage.getItem('COUNT')
      .then(count => {
        if (count === null) count = 0
        setCount(count)
      })
      .catch(error => console.error('Failed to load count:', error.message))
  }

  function saveCount (count) {
    AsyncStorage.setItem('COUNT', String(count))
      .then(() => setCount(count))
      .catch(error => console.error('Failed to save count:', error.message))
  }

  function incrementCount () {
    saveCount(Number(count) + 1)
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Don't touch your face!{'\n'}🚫🤦</Text>
      </View>
      <View style={styles.bodyContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={incrementCount}
          accessibilityLabel="Touch to increase count"
        >
          <Text style={styles.buttonText}>☝️</Text>
        </TouchableOpacity>
        <Text style={styles.count}>
          Count:{' '}
          <Text style={{ color: 'red' }}>
            {count}
          </Text>
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight * 2
  },
  titleContainer: {
    flex: 1
  },
  title: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold'
  },
  bodyContainer: {
    flex: 3,
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 16,
    margin: 20
  },
  buttonText: {
    fontSize: 72,
    color: '#fff',
    textAlign: 'center'
  },
  count: {
    fontSize: 24
  }
})
