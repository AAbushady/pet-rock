import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface WelcomeScreenProps {
  onComplete: (userName: string, petName: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [userName, setUserName] = useState('');
  const [petName, setPetName] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // Track which step we're on

  const handleNextStep = () => {
    if (currentStep === 1 && userName.trim()) {
      setCurrentStep(2);
    }
  };

  const handleComplete = () => {
    if (userName.trim() && petName.trim()) {
      onComplete(userName.trim(), petName.trim());
    }
  };

  const canProceed = currentStep === 1 ? userName.trim().length > 0 : petName.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {currentStep === 1 ? (
          // Step 1: Get user name
          <>
            <Text style={styles.title}>Welcome to Mindful Companion! 🪨</Text>
            <Text style={styles.subtitle}>
              Your journey to better self-care starts with a special companion - your very own pet rock!
            </Text>
            
            <View style={styles.inputSection}>
                             <Text style={styles.question}>What&apos;s your name?</Text>
              <TextInput
                style={styles.input}
                value={userName}
                onChangeText={setUserName}
                placeholder="Enter your name"
                autoFocus
                maxLength={20}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.button, !canProceed && styles.buttonDisabled]}
              onPress={handleNextStep}
              disabled={!canProceed}
            >
              <Text style={styles.buttonText}>Nice to meet you! →</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Step 2: Name the pet rock
          <>
            <Text style={styles.title}>Hi {userName}! 👋</Text>
            <Text style={styles.subtitle}>
              Meet your new companion! This pet rock will grow stronger as you take care of yourself.
            </Text>
            
            <View style={styles.rockPreview}>
              <Text style={styles.rockEmoji}>🪨</Text>
              <Text style={styles.rockDescription}>
                Your pet rock will be happiest when you complete self-care tasks!
              </Text>
            </View>
            
            <View style={styles.inputSection}>
              <Text style={styles.question}>What will you name your pet rock?</Text>
              <TextInput
                style={styles.input}
                value={petName}
                onChangeText={setPetName}
                placeholder="e.g., Rocky, Pebble, Stone..."
                autoFocus
                maxLength={15}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.button, !canProceed && styles.buttonDisabled]}
              onPress={handleComplete}
              disabled={!canProceed}
            >
              <Text style={styles.buttonText}>Start My Journey! 🚀</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setCurrentStep(1)}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 30,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    padding: 10,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
  rockPreview: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 10,
  },
  rockEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  rockDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 