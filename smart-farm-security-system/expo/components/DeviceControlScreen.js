import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase';
import { ref, onValue, push, update, remove } from 'firebase/database';

export default function DeviceControlScreen() {
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [devices, setDevices] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const devicesRef = ref(db, 'devices');
    const unsubscribe = onValue(devicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const deviceList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setDevices(deviceList);
      } else {
        setDevices([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addOrUpdateDevice = () => {
    if (!deviceName.trim() || !deviceType.trim()) {
      Alert.alert('Error', 'Please enter both Device Name and Device Type.');
      return;
    }

    const deviceData = {
      name: deviceName.trim(),
      type: deviceType.trim(),
      createdAt: new Date().toISOString(),
    };

    if (editId) {
      // Update existing device
      update(ref(db, `devices/${editId}`), deviceData)
        .then(() => {
          Alert.alert('Success', 'Device updated successfully!');
          setEditId(null);
          setDeviceName('');
          setDeviceType('');
        })
        .catch((error) => {
          Alert.alert('Error', 'Failed to update device.');
          console.error('Error updating device:', error);
        });
    } else {
      // Add new device
      push(ref(db, 'devices'), deviceData)
        .then(() => {
          Alert.alert('Success', 'Device added successfully!');
          setDeviceName('');
          setDeviceType('');
        })
        .catch((error) => {
          Alert.alert('Error', 'Failed to add device.');
          console.error('Error adding device:', error);
        });
    }
  };

  const editDevice = (device) => {
    setEditId(device.id);
    setDeviceName(device.name);
    setDeviceType(device.type);
  };

  const deleteDevice = (id) => {
    remove(ref(db, `devices/${id}`))
      .then(() => {
        Alert.alert('Success', 'Device deleted successfully!');
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to delete device.');
        console.error('Error deleting device:', error);
      });
  };

  const renderDeviceItem = ({ item }) => (
    <View style={styles.deviceItem}>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceText}>Name: {item.name}</Text>
        <Text style={styles.deviceText}>Type: {item.type}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editDevice(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteDevice(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Control</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Device Name"
          value={deviceName}
          onChangeText={setDeviceName}
        />
        <TextInput
          style={styles.input}
          placeholder="Device Type"
          value={deviceType}
          onChangeText={setDeviceType}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addOrUpdateDevice}
        >
          <Text style={styles.addButtonText}>
            {editId ? 'Update Device' : 'Add Device'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {devices.length === 0 ? (
          <Text style={styles.emptyText}>No devices added yet.</Text>
        ) : (
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={renderDeviceItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  deviceItem: {
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
  deviceInfo: {
    flex: 1,
  },
  deviceText: {
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
});