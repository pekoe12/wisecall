import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

// Twilio backend endpoint
const BACKEND_URL = "https://your-backend-url.com";

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [scamProbability, setScamProbability] = useState(0); // Value between 0 and 1
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Dummy update for scam probability every 2 seconds
    if (isRecording) {
      const interval = setInterval(() => {
        setScamProbability((prev) =>
          prev >= 1 ? 0 : Math.min(prev + Math.random() * 0.2, 1)
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const startTwilioRecording = async () => {
    try {
      setIsRecording(true);
      setIsLoading(true);

      // Call your backend to initiate Twilio call recording
      const response = await fetch(`${BACKEND_URL}/start-recording`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to start Twilio recording");

      Alert.alert("Recording started", "Your call can now be recorded.");
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
      const response = await fetch(`${BACKEND_URL}/stop-recording`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to stop Twilio recording");

      Alert.alert(
        "Recording stopped",
        "Recording has been stopped. Full transcription and analysis will be available shortly."
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not stop recording.");
    } finally {
      setIsRecording(false);
      setIsLoading(false);
      setScamProbability(0); // Reset scam probability
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

      {isRecording && (
        <View style={styles.analysis}>
          <AnimatedCircularProgress
            size={150}
            width={15}
            fill={scamProbability * 100} // Convert to percentage
            tintColor={
              scamProbability > 0.7
                ? "#f44336" // High-risk (red)
                : scamProbability > 0.4
                ? "#FFA000" // Medium-risk (orange)
                : "#4CAF50" // Low-risk (green)
            }
            backgroundColor="#ddd"
          >
            {(fill) => (
              <Text style={styles.probabilityValue}>
                {Math.round(scamProbability * 100)}%
              </Text>
            )}
          </AnimatedCircularProgress>

          <Text style={styles.probability}>
            Scam Probability:{" "}
            <Text
              style={[
                styles.probabilityValue,
                scamProbability > 0.7
                  ? styles.highRisk
                  : scamProbability > 0.4
                  ? styles.mediumRisk
                  : styles.lowRisk,
              ]}
            >
              {Math.round(scamProbability * 100)}%
            </Text>
          </Text>
        </View>
      )}

      {transcription && (
        <View style={styles.results}>
          <Text style={styles.heading}>Live Transcription:</Text>
          <Text style={styles.transcription}>{transcription}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 50,
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recording: {
    backgroundColor: "#f44336",
  },
  loading: {
    backgroundColor: "#FFA000",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  analysis: {
    marginTop: 30,
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  probability: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  probabilityValue: {
    fontWeight: "bold",
  },
  highRisk: {
    color: "#f44336",
  },
  mediumRisk: {
    color: "#FFA000",
  },
  lowRisk: {
    color: "#4CAF50",
  },
  results: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    width: "100%",
    elevation: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  transcription: {
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
  },
});