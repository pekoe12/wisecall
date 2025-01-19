import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

// Twilio backend endpoint
const BACKEND_URL = "https://your-backend-url.com";

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [scamProbability, setScamProbability] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const startTwilioRecording = async () => {
    try {
      setIsRecording(true);
      setIsLoading(true);

      // Call your backend to initiate Twilio call recording
      const response = await fetch(`${BACKEND_URL}/start-twilio-recording`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to start Twilio recording");

      Alert.alert("Recording started", "Twilio is now recording your call.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not start recording.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopTwilioRecording = async () => {
    try {
      setIsLoading(true);

      // Call your backend to stop Twilio recording
      const response = await fetch(`${BACKEND_URL}/stop-twilio-recording`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to stop Twilio recording");

      Alert.alert("Recording stopped", "Twilio call recording has ended.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not stop recording.");
    } finally {
      setIsRecording(false);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spam Call Detector</Text>

      <TouchableOpacity
        style={[
          styles.button,
          isRecording ? styles.recording : null,
          isLoading ? styles.loading : null,
        ]}
        onPress={isRecording ? stopTwilioRecording : startTwilioRecording}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading
            ? "Processing..."
            : isRecording
            ? "Stop Recording"
            : "Start Recording"}
        </Text>
      </TouchableOpacity>

      {transcription ? (
        <View style={styles.results}>
          <Text style={styles.heading}>Live Transcription:</Text>
          <Text style={styles.transcription}>{transcription}</Text>

          <Text style={styles.heading}>
            Scam Probability: {Math.round(scamProbability * 100)}%
          </Text>
        </View>
      ) : null}
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