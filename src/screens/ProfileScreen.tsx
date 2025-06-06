import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../services/AppContext';
import { calculateLifePathNumber, formatDate, getWesternZodiac, getChineseZodiac } from '../utils/numerology';

const ProfileScreen = () => {
  const { userInfo, isLoading, error } = useAppContext();
  const [lifePathNumber, setLifePathNumber] = React.useState<number | null>(null);

  // Calculate life path number when user info is available
  React.useEffect(() => {
    if (userInfo?.birthdate) {
      const lpn = calculateLifePathNumber(userInfo.birthdate);
      setLifePathNumber(lpn);
    }
  }, [userInfo]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No profile found. Please complete onboarding.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Profile</Text>
      </View>

      {/* Personal Information Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person" size={20} color="#8b5cf6" />
          <Text style={styles.cardTitle}>Personal Information</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{userInfo.name}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Date of Birth</Text>
          <Text style={styles.infoValue}>{formatDate(userInfo.birthdate)}</Text>
        </View>
        
        {userInfo.birthplace && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Birthplace</Text>
            <Text style={styles.infoValue}>{userInfo.birthplace}</Text>
          </View>
        )}
        
        {userInfo.birthtime && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Time of Birth</Text>
            <Text style={styles.infoValue}>{userInfo.birthtime}</Text>
          </View>
        )}
      </View>

      {/* Numerology Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calculator" size={20} color="#8b5cf6" />
          <Text style={styles.cardTitle}>Numerology & Astrology</Text>
        </View>
        
        {/* Life Path Number */}
        <View style={styles.numerologyBox}>
          <Text style={styles.boxTitle}>Life Path Number</Text>
          {lifePathNumber !== null && (
            <>
              <Text style={styles.lifePathNumber}>{lifePathNumber}</Text>
              <Text style={styles.boxDescription}>
                Your Life Path Number represents your life purpose and the path you'll take to fulfill that purpose.
              </Text>
            </>
          )}
        </View>
        
        {/* Zodiac Signs */}
        <View style={styles.numerologyBox}>
          <Text style={styles.boxTitle}>Zodiac Signs</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Western Zodiac</Text>
            <Text style={styles.infoValue}>{getWesternZodiac(userInfo.birthdate)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Chinese Zodiac</Text>
            <Text style={styles.infoValue}>{getChineseZodiac(userInfo.birthdate)}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
  },
  numerologyBox: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  lifePathNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginVertical: 12,
  },
  boxDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default ProfileScreen;
