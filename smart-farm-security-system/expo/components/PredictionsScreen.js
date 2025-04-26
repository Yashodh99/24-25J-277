import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../firebase';
import { ref, onValue, remove, set, push, get } from 'firebase/database';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

const API_URL = 'http://10.11.206.138:8000/predict/';

export default function PredictionsScreen({ route }) {
  const [predictions, setPredictions] = useState([]);
  const [nextPrediction, setNextPrediction] = useState(null);
  const [waitingForResponse, setWaitingForResponse] = useState([]);
  const [validationMode, setValidationMode] = useState('Manual'); // Default to Manual for testing
  const [authError, setAuthError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getSensorData = () => {
    return {
      Frequency: Math.random() * 100,
      Amplitude: Math.random() * 50,
      Duration: Math.random() * 20,
    };
  };

  
    return () => unsubscribe();
  }, []);

  

    const tempRef = ref(db, 'temp_predictions');
    get(tempRef).then((snapshot) => {
      const tempData = snapshot.val();
      if (tempData) {
        const latestPrediction = Object.values(tempData).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setNextPrediction(latestPrediction);
      } else {
        predictNextEvent();
      }
    });

    checkAndMovePredictions();

    
      }
    });
  };
      const now = new Date();
      const sennsorData.Amplitude);
    const durDiff = Math.abs(prediction.Duration - sensorData.Duration);
    return freqDiff < 20 && ampDiff < 10 && durDiff < 5;
  };

  const savePrediction = (prediction) => {
    if (!isAuthenticated) {
      setAuthError('Cannot save prediction: Not authenticated');
      return;
    }
    const predictionsRef = ref(db, 'predictions');
    const newPredictionRef = push(predictionsRef);
    set(newPredictionRef, prediction)
      .then(() => console.log('Prediction saved:', prediction))
      .catch((error) => {
        console.error('Error saving prediction:', error);
        setAuthError('Failed to save prediction: ' + error.message);
      });
  };

  const moveToPredictions = (id, prediction) => {
    if (!isAuthenticated) return;
    const predictionsRef = ref(db, 'predictions');
    const newPredictionRef = push(predictionsRef);
    set(newPredictionRef, prediction)
      .then(() => console.log('Moved to predictions:', prediction))
      .catch((error) => console.error('Error moving to predictions:', error));
  };

  const moveToWaiting = (id, prediction) => {
    if (!isAuthenticated) return;
    const waitingRef = ref(db, 'waiting_for_response');
    const newWaitingRef = push(waitingRef);
    set(newWaitingRef, prediction)
      .then(() => console.log('Moved to waiting:', prediction))
      .catch((error) => console.error('Error moving to waiting:', error));
  };

  const handleRefresh = () => {
    if (nextPrediction && new Date(nextPrediction.time_window.end) > new Date()) {
      console.log('Active prediction exists, cannot refresh until time window ends.');
      return;
    }
    predictNextEvent();
  };

  const deletePrediction = (id) => {
    if (!isAuthenticated) {
      setAuthError('Cannot delete prediction: Not authenticated');
      return;
    }
    remove(ref(db, `predictions/${id}`))
      .then(() => {
        Alert.alert('Success', 'Prediction deleted successfully!');
        setPredictions((prev) => prev.filter((pred) => pred.id !== id));
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to delete prediction.');
        console.error('Error deleting prediction:', error);
        setAuthError('Failed to delete prediction: ' + error.message);
      });
  };

  const clearAllPredictions = () => {
    if (!isAuthenticated) {
      setAuthError('Cannot clear predictions: Not authenticated');
      return;
    }
    remove(ref(db, 'predictions'))
      .then(() => {
        Alert.alert('Success', 'All predictions cleared!');
        setPredictions([]);
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to clear predictions.');
        console.error('Error clearing predictions:', error);
        setAuthError('Failed to clear predictions: ' + error.message);
      });
  };

  const handleManualResponse = (prediction, action) => {
    if (!isAuthenticated) {
      setAuthError('Cannot process response: Not authenticated');
      return;
    }
    remove(ref(db, `waiting_for_response/${prediction.id}`))
      .then(() => {
        if (action === 'correct') {
          const predictionsRef = ref(db, 'predictions');
          const newPredictionRef = push(predictionsRef);
          set(newPredictionRef, { ...prediction, validated: true });
          Alert.alert('Success', 'Prediction confirmed and saved!');
        } else if (action === 'wrong') {
          const incorrectRef = ref(db, 'incorrect_predictions');
          const newIncorrectRef = push(incorrectRef);
          set(newIncorrectRef, prediction);
          Alert.alert('Success', 'Prediction marked as incorrect.');
        } else if (action === 'dismiss') {
          const dismissedRef = ref(db, 'dismissed_predictions');
          const newDismissedRef = push(dismissedRef);
          set(newDismissedRef, prediction);
          Alert.alert('Success', 'Prediction dismissed.');
        }
        setWaitingForResponse((prev) => prev.filter((pred) => pred.id !== prediction.id));
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to process response.');
        console.error('Error processing manual response:', error);
        setAuthError('Failed to process response: ' + error.message);
      });
  };

  const renderPredictionItem = ({ item }) => {
    if (item.type === 'header') {
      const isRefreshDisabled = nextPrediction && new Date(nextPrediction.time_window.end) > new Date();
      return (
        <View style={styles.header}>
          <Text style={styles.title}>Predictions</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={[styles.refreshButton, isRefreshDisabled && styles.disabledButton]}
            disabled={isRefreshDisabled}
          >
            <Icon name="refresh" size={30} color={isRefreshDisabled ? '#ccc' : '#333'} />
          </TouchableOpacity>
        </View>
      );
    }
    if (item.type === 'error') {
      return authError ? <Text style={styles.errorText}>{authError}</Text> : null;
    }
    if (item.type === 'mode') {
      return (
        <View style={styles.mode}>
          <Text style={styles.sectionTitle}>Validation Mode</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setValidationMode('Auto')}
            >
              <View style={[styles.radio, validationMode === 'Auto' && styles.selectedRadio]} />
              <Text>Auto (Sensor-Based)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setValidationMode('Manual')}
            >
              <View style={[styles.radio, validationMode === 'Manual' && styles.selectedRadio]} />
              <Text>Manual (User-Confirmed)</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (item.type === 'nextPrediction') {
      return (
        <View style={styles.nextPredictionContainer}>
          <Text style={styles.sectionTitle}>Next Possible Intrusion</Text>
          {nextPrediction ? (
            <Text style={styles.nextPredictionText}>
              {nextPrediction.animal} between{' '}
              {new Date(nextPrediction.time_window?.start).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} and{' '}
              {new Date(nextPrediction.time_window?.end).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}
              {validationMode === 'Manual' && (
                <Text style={[styles.confidenceText, {
                  color: nextPrediction.confidence < 40 ? 'red' :
                         nextPrediction.confidence <= 70 ? 'yellow' :
                         'green'
                }]}>
                  {' '}Confidence: {nextPrediction.confidence.toFixed(2)}%
                </Text>
              )}
            </Text>
          ) : (
            <Text style={styles.nextPredictionText}>Calculating...</Text>
          )}
        </View>
      );
    }
    if (item.type === 'waitingSection') {
      return (
        <View style={styles.waitingContainer}>
          <Text style={styles.sectionTitle}>Waiting for Response</Text>
          {waitingForResponse.length === 0 ? (
            <Text style={styles.emptyText}>No predictions awaiting response.</Text>
          ) : (
            waitingForResponse.map((waitingItem) => renderPredictionItem({ item: { ...waitingItem, type: 'waiting' } }))
          )}
        </View>
      );
    }
    if (item.type === 'historySection') {
      return (
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Prediction History</Text>
          {predictions.length === 0 ? (
            <Text style={styles.emptyText}>No predictions yet.</Text>
          ) : (
            <>
              {predictions.map((predictionItem) => renderPredictionItem({ item: { ...predictionItem, type: 'prediction' } }))}
              <TouchableOpacity style={styles.clearButton} onPress={clearAllPredictions}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      );
    }
    if (item.type === 'prediction') {
      return (
        <View style={styles.item}>
          <View style={styles.predictionInfo}>
            <Text style={styles.predictionText}>
              {item.notification || `${item.animal} - ${item.time_window?.start} to ${item.time_window?.end} (${item.mode})`}
            </Text>
            <Text style={styles.createdAtText}>
              Created: {new Date(item.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deletePrediction(item.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (item.type === 'waiting') {
      const confidenceColor =
        item.confidence < 40 ? 'red' :
        item.confidence <= 70 ? 'yellow' :
        'green';
      return (
        <View style={styles.item}>
          <View style={styles.predictionInfo}>
            <Text style={styles.predictionText}>
              {item.animal} between {new Date(item.time_window?.start).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} and{' '}
              {new Date(item.time_window?.end).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}
            </Text>
            <Text style={[styles.confidenceText, { color: confidenceColor }]}>
              Confidence: {item.confidence.toFixed(2)}%
            </Text>
          </View>
          <View style={styles.responseButtons}>
            <TouchableOpacity
              style={[styles.responseButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleManualResponse(item, 'correct')}
            >
              <Text style={styles.responseButtonText}>Correct</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.responseButton, { backgroundColor: '#FF4444' }]}
              onPress={() => handleManualResponse(item, 'wrong')}
            >
              <Text style={styles.responseButtonText}>Wrong</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.responseButton, { backgroundColor: '#666' }]}
              onPress={() => handleManualResponse(item, 'dismiss')}
            >
              <Text style={styles.responseButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  const flatListData = [
    { type: 'header' },
    { type: 'error' },
    { type: 'mode' },
    { type: 'nextPrediction' },
    ...(validationMode === 'Manual' ? [{ type: 'waitingSection' }] : []),
    { type: 'historySection' },
  ];

  return (
    <FlatList
      data={flatListData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderPredictionItem}
      ListFooterComponent={<View style={styles.bottomSpacer} />}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  mode: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 10,
  },
  selectedRadio: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  nextPredictionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  nextPredictionText: {
    fontSize: 16,
    color: '#666',
  },
  confidenceText: {
    fontSize: 14,
    marginTop: 5,
  },
  waitingContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  historyContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  predictionInfo: {
    flex: 1,
  },
  predictionText: {
    fontSize: 16,
    color: '#333',
  },
  createdAtText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  responseButtons: {
    flexDirection: 'row',
  },
  responseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  responseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginVertical: 20,
  },
  clearButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 50,
  },
});