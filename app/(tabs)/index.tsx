// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { PetRock } from '../../components/PetRock';
import StorageService, { UserProgress } from '../../services/storage';

export default function HomeScreen() {
  const [bond, setBond] = useState(0);
  const [xp, setXp] = useState(0);
  const [petName, setPetName] = useState("Rocky");
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  
  // load saved data when app starts
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedProgress = await StorageService.getUserProgress();
                
        if (savedProgress) {
          setBond(savedProgress.petBond);
          setXp(savedProgress.totalXP);
          setPetName(savedProgress.petName);
        }
        
      } catch (error) {
        console.log("LOADING: Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedData();
  }, []);

  // save data whenever bond or xp changess
  useEffect(() => {
    if (isLoading) {
      return;
    }
    
    const saveData = async () => {
      const progressData: UserProgress = {
        petName: petName,
        totalXP: xp,
        currentStreak: 0,
        lastCheckIn: new Date().toISOString(),
        petBond: bond,
        level: Math.floor(xp / 100) + 1
      };
      
      await StorageService.saveUserProgress(progressData);
    };
    
    saveData();
  }, [bond, xp, petName, isLoading]);
  
  const handlePetRock = () => {
    // Increase happiness (max 100)
    setBond(prev => Math.min(prev + 10, 100));
    // Award XP
    setXp(prev => prev + 5);
  };
  
  const completeTask = (taskXp: number) => {
    setXp(prev => prev + taskXp);
    setBond(prev => Math.min(prev + 5, 100));
  };

  const handleNameChange = (newName: string) => {
    setPetName(newName);
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your pet rock...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mindful Companion</Text>
        <Text style={styles.xp}>XP: {xp}</Text>
      </View>
      
      <PetRock 
        name={petName} 
        bond={bond}
        onPet={handlePetRock}
        onNameChange={handleNameChange}
      />
      
      <View style={styles.tasks}>
        <Text style={styles.sectionTitle}>Today&apos;s Self-Care</Text>
        
        <View style={styles.taskButton}>
          <Button 
            title="✓ Drink Water (5 XP)" 
            onPress={() => completeTask(5)}
          />
        </View>
        
        <View style={styles.taskButton}>
          <Button 
            title="✓ Take 5 Deep Breaths (10 XP)" 
            onPress={() => completeTask(10)}
          />
        </View>
        
        <View style={styles.taskButton}>
          <Button 
            title="✓ Write in Journal (15 XP)" 
            onPress={() => completeTask(15)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  xp: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  tasks: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  taskButton: {
    marginVertical: 5,
  },
});