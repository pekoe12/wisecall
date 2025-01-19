import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Mock function to simulate recording and analysis
  const handlePress = async () => {
    if (!isRecording) {
      // Start "recording"
      setIsRecording(true);
    } else {
      // Stop "recording" and show mock analysis
      setIsRecording(false);
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        setAnalysis({
          transcript: "Hello, this is your bank calling about your account security. We need your immediate attention.",
          spam_probability: 0.89
        });
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spam Call Detector</Text>
      
      <TouchableOpacity 
        style={[
          styles.button, 
          isRecording ? styles.recording : null,
          isLoading ? styles.loading : null
        ]}
        onPress={handlePress}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Analyzing...' : 
           isRecording ? 'Stop Recording' : 
           'Start Recording'}
        </Text>
      </TouchableOpacity>

      {analysis && (
        <View style={styles.analysis}>
          <Text style={styles.heading}>Analysis Results:</Text>
          <Text style={styles.probability}>
            Spam Probability: 
            <Text style={[
              styles.probabilityValue,
              analysis.spam_probability > 0.7 ? styles.highRisk : 
              analysis.spam_probability > 0.4 ? styles.mediumRisk : 
              styles.lowRisk
            ]}>
              {' '}{(analysis.spam_probability * 100).toFixed(1)}%
            </Text>
          </Text>
          <Text style={styles.transcriptLabel}>Call Transcript:</Text>
          <Text style={styles.transcript}>{analysis.transcript}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 50,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recording: {
    backgroundColor: '#f44336',
  },
  loading: {
    backgroundColor: '#FFA000',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  analysis: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  probability: {
    fontSize: 16,
    marginBottom: 15,
  },
  probabilityValue: {
    fontWeight: 'bold',
  },
  highRisk: {
    color: '#f44336',
  },
  mediumRisk: {
    color: '#FFA000',
  },
  lowRisk: {
    color: '#4CAF50',
  },
  transcriptLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  transcript: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  }
});
