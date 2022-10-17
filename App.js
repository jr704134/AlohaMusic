import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Feather } from '@expo/vector-icons';

const drums = require('./images/drums.png');
const drumSound = require('./music/drums.mp3');
const ukulele = require('./images/ukulele.png');
const ukuleleSound = require('./music/ukulele.mp3');

export default class App extends Component {
  
  state = {
    isPlaying: false,
    playbackInstance: null,
    volume: 1.0,
    isBuffering: false,
  }

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    this.loadAudio();
  }
  
  handlePlayPause = async () => {
    const { isPlaying, playbackInstance } = this.state;
    isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();
    this.setState({
      isPlaying: !isPlaying
    });
  }

  async loadAudio() {
    const playbackInstance = new Audio.Sound();
    const source = {ukuleleSound, drumSound}
		const status = {
			shouldPlay: this.state.isPlaying,
			volume: this.state.volume,
    };
    playbackInstance
      .setOnPlaybackStatusUpdate(
        this.onPlaybackStatusUpdate
      );
    await playbackInstance.loadAsync(source, status, false);
    this.setState({
      playbackInstance
    });
  }

  onPlaybackStatusUpdate = (status) => {
    this.setState({
      isBuffering: status.isBuffering
    });
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Aloha Music</Text>
        <Image source={ukulele} style={styles.image} />
          <TouchableOpacity
            style={styles.control}
            onPress={this.handlePlayPause}>
              {this.state.isPlaying ?
              <Feather name="pause" size={32} /> :
              <Feather name="play" size={32} />
              }
          </TouchableOpacity>
        <Image source={drums} style={styles.image} />
        <TouchableOpacity
            style={styles.control}
            onPress={this.handlePlayPause}>
              {this.state.isPlaying ?
              <Feather name="pause" size={32} /> :
              <Feather name="play" size={32} />
              }
          </TouchableOpacity>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e3cf',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#563822',
  },
  image: {
    height: 210,
    width: 350,
    marginTop: 20,
  },
  title: {
    width: 350,
    backgroundColor: '#da9547',
    fontSize: 32,
    height: 36,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  control: {
    margin: 10,
  }
});
