// components/PetRock.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  //Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

//const { width } = Dimensions.get('window');

interface PetRockProps {
  name: string;
  bond: number;
  onPet: () => void;
  onNameChange: (newName: string) => void;
}

export const PetRock: React.FC<PetRockProps> = ({ name, bond, onPet, onNameChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  
  // bond affects size
  useEffect(() => {
    scale.value = withSpring(0.8 + (bond / 100) * 0.4);
  }, [bond, scale]);

  // name changes
  useEffect(() => {
    setTempName(name);
  }, [name]);
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ]
    };
  });
  
  // Handle pet interaction
  const handlePet = () => {
    'worklet';
    // Bounce animation
    scale.value = withSequence(
      withTiming(scale.value * 1.2, { duration: 100 }),
      withSpring(scale.value)
    );
    
    // Wiggle animation
    rotation.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(0, { duration: 50 })
    );
    
    // Call the parent's onPet function
    runOnJS(onPet)();
  };
  
  // Get emoji based on bond
  const getEmoji = () => {
    if (bond > 80) return '😊';
    if (bond > 60) return '🙂';
    if (bond > 40) return '😐';
    if (bond > 20) return '😕';
    return '😢';
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePet} activeOpacity={0.8}>
        <Animated.View style={[styles.rock, animatedStyle]}>
          <Text style={styles.face}>{getEmoji()}</Text>
        </Animated.View>
      </TouchableOpacity>
      <View style={styles.nameContainer}>
        {isEditing ? (
          <TextInput
            style={styles.nameInput}
            value={tempName}
            onChangeText={setTempName}
            onBlur={() => {
              setIsEditing(false);
              onNameChange(tempName);
            }}
            autoFocus
          />
        ) : (
          <Text style={styles.name}>{name}</Text>
        )}
        
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <Ionicons name="pencil" size={16} color="#666" />
        </TouchableOpacity>
      </View>
      <View style={styles.bondBar}>
        <View 
          style={[
            styles.bondFill, 
            { width: `${bond}%` }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  rock: {
    width: 120,
    height: 120,
    backgroundColor: '#8B7355',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  face: {
    fontSize: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    minWidth: 100,
  },
  bondBar: {
    width: 150,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginTop: 10,
    overflow: 'hidden',
  },
  bondFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
});