import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';
 import Slider from '@react-native-community/slider';

interface AudioPlayerWithSliderProps {
  audioUri: string;
}

const AudioPlayerWithVisualizer: React.FC<AudioPlayerWithSliderProps> = ({ audioUri }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = new Sound(audioUri, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load audio', error);
        return;
      }
      setSound(audio);
      setDuration(audio.getDuration()); // Get duration of the audio
    });

    // Cleanup on unmount
    return () => {
      audio.release();
    };
  }, [audioUri]);

  const handlePlayPause = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
    } else {
      sound.play(() => setIsPlaying(false)); // Reset to paused when playback completes
      setIsPlaying(true);
      startCurrentTimeTracking();
    }
  };

  // Function to track current time periodically while playing
  const startCurrentTimeTracking = () => {
    const interval = setInterval(() => {
      sound?.getCurrentTime((time) => {
        setCurrentTime(time);
      });
    }, 10);

    // Cleanup on unmount
    return () => clearInterval(interval);
  };

  // Function to handle slider value changes
  const seekAudio = (value: number) => {
    if (sound) {
      sound.setCurrentTime(value);
      setCurrentTime(value);
    }
  };

  return (
    <View style={styles.container}>
      {/* Play/Pause Button */}
      <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
        <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={20} color="white" />
      </TouchableOpacity>

      
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={currentTime}
        onValueChange={seekAudio}
        minimumTrackTintColor="#635acc"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#ffffff"
      />

      <Text style={styles.timeText}>
        {`${Math.floor(currentTime / 60)}:${(currentTime % 60).toFixed(0).padStart(2, '0')} / ${Math.floor(duration / 60)}:${(duration % 60).toFixed(0).padStart(2, '0')}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#382F66',
        borderRadius: 15,
        paddingHorizontal: 17,
        paddingVertical: 4,
        fontSize: 16,
        color: 'white',
        marginHorizontal: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
      },
  playPauseButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#635acc',
    alignItems: 'center',
    justifyContent: 'center',
    //marginBottom: 15,
  },
  slider: {
    width: '50%',
    height: 40,
  },
  timeText: {
    color: 'white',
    //marginTop: 10,
  },
});

export default AudioPlayerWithVisualizer;
