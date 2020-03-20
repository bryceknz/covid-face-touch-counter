import React from 'react'
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AppState
} from 'react-native'
import Constants from 'expo-constants'

export default class App extends React.Component {
  state = {
    count: 0,
    yesterdaysCount: null,
    appState: AppState.currentState
  }

  async componentDidMount () {
    AppState.addEventListener('change', this.handleAppStateChange)
    await this.checkDate()
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = async (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      await this.checkDate()
    }
    this.setState({ appState: nextAppState })
  }

  checkDate = async (clicked) => {
    let currentDate = this.getCurrentDate()

    let savedDate = await AsyncStorage.getItem('STORED-DATE')
    if (savedDate) {
      // A new day has begun!
      if (currentDate !== savedDate) {
        // Store yesterday's count
        await this.setYesterdaysCount(this.state.count)
        // Update stored date
        await this.updateDate(currentDate)
        // Reset count to 1 if clicked or 0 if app reloaded
        clicked ? await this.resetCount(1) : await this.resetCount(0)
      } else if (clicked) {
        // Update count
        await this.incrementCount()
      }
    } else {
      // Set initial stored date
      await this.updateDate(currentDate)
      // Set initial count to zero
      await this.resetCount(0)
    }
  }

  setYesterdaysCount = async (yesterdaysCount) => {
    await AsyncStorage.setItem('YESTERDAYS-COUNT', String(yesterdaysCount))
    this.setState({ yesterdaysCount })
  }

  updateDate = async (currentDate) => {
    await AsyncStorage.setItem('STORED-DATE', currentDate)
  }

  resetCount = async (count) => {
    await AsyncStorage.setItem('COUNT', String(count))
    this.setState({ count })
  }

  incrementCount = async () => {
    const count = this.state.count + 1
    await AsyncStorage.setItem('COUNT', String(count))
    this.setState({ count })
  }

  getCurrentDate = () => (new Date()).toDateString()

  render () {
    const { count, yesterdaysCount } = this.state

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Don't touch your face!{'\n'}🚫🤦</Text>
        </View>
        <View style={styles.bodyContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.checkDate(true)}
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
          {yesterdaysCount !== null && <Text style={styles.yesterday}>Yesterday's count: {yesterdaysCount}</Text>}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight * 2
  },
  titleContainer: {
    flex: 2
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
    fontSize: 24,
    textAlign: 'center'
  },
  yesterday: {
    textAlign: 'center'
  }
})
