import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../services/AppContext';
import { calculateLifePathNumber, getWesternZodiac, getChineseZodiac } from '../utils/numerology';

const NumerologyScreen = () => {
  const { userInfo, isLoading, error } = useAppContext();
  const [activeTab, setActiveTab] = React.useState('lifePath');

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading numerology data...</Text>
      </View>
    );
  }

  if (error || !userInfo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'No user data found. Please complete onboarding.'}
        </Text>
      </View>
    );
  }

  // Calculate numerology values
  const lifePathNumber = calculateLifePathNumber(userInfo.birthdate);
  const westernZodiac = getWesternZodiac(userInfo.birthdate);
  const chineseZodiac = getChineseZodiac(userInfo.birthdate);

  // Get life path number meaning
  const getLifePathMeaning = (number: number) => {
    const meanings: {[key: number]: string} = {
      1: "You're a natural leader with strong independence and creativity. Your path involves developing confidence and individuality while learning to collaborate with others.",
      2: "You're a peacemaker with diplomatic skills and sensitivity. Your path involves developing patience, cooperation, and finding balance in relationships.",
      3: "You're expressive, creative, and sociable. Your path involves developing communication skills and using your creativity to inspire others.",
      4: "You're practical, organized, and hardworking. Your path involves building stable foundations and learning the value of persistence and determination.",
      5: "You're adventurous, versatile, and freedom-loving. Your path involves embracing change and using your adaptability to navigate life's experiences.",
      6: "You're responsible, caring, and service-oriented. Your path involves nurturing others while learning to balance giving with self-care.",
      7: "You're analytical, introspective, and spiritual. Your path involves seeking knowledge and developing your inner wisdom.",
      8: "You're ambitious, goal-oriented, and business-minded. Your path involves mastering material success while maintaining ethical integrity.",
      9: "You're compassionate, idealistic, and humanitarian. Your path involves serving humanity and working toward the greater good.",
      11: "As a master number, you're highly intuitive and inspirational. Your path involves spiritual enlightenment and inspiring others through your vision.",
      22: "As a master number, you're a practical visionary and master builder. Your path involves turning dreams into reality on a large scale.",
      33: "As a master number, you're a nurturing teacher and healer. Your path involves selfless service and uplifting humanity through compassion."
    };
    
    return meanings[number] || "This number represents a unique combination of energies in your life path.";
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'lifePath':
        return (
          <View style={styles.tabContent}>
            <View style={styles.numberCircle}>
              <Text style={styles.bigNumber}>{lifePathNumber}</Text>
            </View>
            <Text style={styles.meaningTitle}>Life Path Number</Text>
            <Text style={styles.meaningText}>
              {getLifePathMeaning(lifePathNumber)}
            </Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>What is a Life Path Number?</Text>
              <Text style={styles.infoText}>
                Your Life Path Number is derived from your birth date and represents your life's purpose and the path you'll take to fulfill that purpose. It reveals your natural talents, abilities, and the lessons you'll learn throughout your life.
              </Text>
            </View>
          </View>
        );
      
      case 'westernZodiac':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.zodiacTitle}>{westernZodiac}</Text>
            <Text style={styles.zodiacDates}>
              {getZodiacDateRange(westernZodiac)}
            </Text>
            <Text style={styles.meaningText}>
              {getWesternZodiacMeaning(westernZodiac)}
            </Text>
            <View style={styles.traitContainer}>
              <View style={styles.traitItem}>
                <Text style={styles.traitTitle}>Element</Text>
                <Text style={styles.traitValue}>{getZodiacElement(westernZodiac)}</Text>
              </View>
              <View style={styles.traitItem}>
                <Text style={styles.traitTitle}>Quality</Text>
                <Text style={styles.traitValue}>{getZodiacQuality(westernZodiac)}</Text>
              </View>
              <View style={styles.traitItem}>
                <Text style={styles.traitTitle}>Ruling Planet</Text>
                <Text style={styles.traitValue}>{getZodiacPlanet(westernZodiac)}</Text>
              </View>
            </View>
          </View>
        );
      
      case 'chineseZodiac':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.zodiacTitle}>{chineseZodiac}</Text>
            <Text style={styles.meaningText}>
              {getChineseZodiacMeaning(chineseZodiac)}
            </Text>
            <View style={styles.traitContainer}>
              <View style={styles.traitItem}>
                <Text style={styles.traitTitle}>Element</Text>
                <Text style={styles.traitValue}>{getChineseElement(chineseZodiac)}</Text>
              </View>
              <View style={styles.traitItem}>
                <Text style={styles.traitTitle}>Yin/Yang</Text>
                <Text style={styles.traitValue}>{getChineseYinYang(chineseZodiac)}</Text>
              </View>
              <View style={styles.traitItem}>
                <Text style={styles.traitTitle}>Lucky Colors</Text>
                <Text style={styles.traitValue}>{getChineseLuckyColors(chineseZodiac)}</Text>
              </View>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Numerology & Astrology</Text>
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'lifePath' && styles.activeTabButton]}
          onPress={() => setActiveTab('lifePath')}
        >
          <Ionicons 
            name="calculator-outline" 
            size={20} 
            color={activeTab === 'lifePath' ? '#8b5cf6' : '#9ca3af'} 
          />
          <Text style={[styles.tabText, activeTab === 'lifePath' && styles.activeTabText]}>
            Life Path
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'westernZodiac' && styles.activeTabButton]}
          onPress={() => setActiveTab('westernZodiac')}
        >
          <Ionicons 
            name="star-outline" 
            size={20} 
            color={activeTab === 'westernZodiac' ? '#8b5cf6' : '#9ca3af'} 
          />
          <Text style={[styles.tabText, activeTab === 'westernZodiac' && styles.activeTabText]}>
            Western
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'chineseZodiac' && styles.activeTabButton]}
          onPress={() => setActiveTab('chineseZodiac')}
        >
          <Ionicons 
            name="moon-outline" 
            size={20} 
            color={activeTab === 'chineseZodiac' ? '#8b5cf6' : '#9ca3af'} 
          />
          <Text style={[styles.tabText, activeTab === 'chineseZodiac' && styles.activeTabText]}>
            Chinese
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.contentContainer}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

// Helper functions for zodiac information
const getZodiacDateRange = (sign: string): string => {
  const ranges: {[key: string]: string} = {
    'Aries': 'March 21 - April 19',
    'Taurus': 'April 20 - May 20',
    'Gemini': 'May 21 - June 20',
    'Cancer': 'June 21 - July 22',
    'Leo': 'July 23 - August 22',
    'Virgo': 'August 23 - September 22',
    'Libra': 'September 23 - October 22',
    'Scorpio': 'October 23 - November 21',
    'Sagittarius': 'November 22 - December 21',
    'Capricorn': 'December 22 - January 19',
    'Aquarius': 'January 20 - February 18',
    'Pisces': 'February 19 - March 20'
  };
  return ranges[sign] || '';
};

const getZodiacElement = (sign: string): string => {
  const elements: {[key: string]: string} = {
    'Aries': 'Fire',
    'Taurus': 'Earth',
    'Gemini': 'Air',
    'Cancer': 'Water',
    'Leo': 'Fire',
    'Virgo': 'Earth',
    'Libra': 'Air',
    'Scorpio': 'Water',
    'Sagittarius': 'Fire',
    'Capricorn': 'Earth',
    'Aquarius': 'Air',
    'Pisces': 'Water'
  };
  return elements[sign] || '';
};

const getZodiacQuality = (sign: string): string => {
  const qualities: {[key: string]: string} = {
    'Aries': 'Cardinal',
    'Taurus': 'Fixed',
    'Gemini': 'Mutable',
    'Cancer': 'Cardinal',
    'Leo': 'Fixed',
    'Virgo': 'Mutable',
    'Libra': 'Cardinal',
    'Scorpio': 'Fixed',
    'Sagittarius': 'Mutable',
    'Capricorn': 'Cardinal',
    'Aquarius': 'Fixed',
    'Pisces': 'Mutable'
  };
  return qualities[sign] || '';
};

const getZodiacPlanet = (sign: string): string => {
  const planets: {[key: string]: string} = {
    'Aries': 'Mars',
    'Taurus': 'Venus',
    'Gemini': 'Mercury',
    'Cancer': 'Moon',
    'Leo': 'Sun',
    'Virgo': 'Mercury',
    'Libra': 'Venus',
    'Scorpio': 'Pluto',
    'Sagittarius': 'Jupiter',
    'Capricorn': 'Saturn',
    'Aquarius': 'Uranus',
    'Pisces': 'Neptune'
  };
  return planets[sign] || '';
};

const getWesternZodiacMeaning = (sign: string): string => {
  const meanings: {[key: string]: string} = {
    'Aries': 'As an Aries, you are energetic, confident, and a natural leader. You approach life with enthusiasm and courage, always ready for new challenges. Your pioneering spirit drives you to be first in everything you do.',
    'Taurus': 'As a Taurus, you are reliable, practical, and devoted. You value stability and comfort, approaching life with patience and determination. Your grounded nature helps you build lasting foundations in all areas of life.',
    'Gemini': 'As a Gemini, you are versatile, curious, and communicative. You approach life with intellectual curiosity and adaptability. Your quick wit and social nature help you connect with diverse people and ideas.',
    'Cancer': 'As a Cancer, you are nurturing, intuitive, and protective. You approach life with emotional depth and sensitivity. Your caring nature creates strong bonds with family and close friends.',
    'Leo': 'As a Leo, you are confident, creative, and generous. You approach life with warmth and dramatic flair. Your natural leadership and charisma draw others to your vibrant energy.',
    'Virgo': 'As a Virgo, you are analytical, practical, and detail-oriented. You approach life with precision and a desire for improvement. Your methodical nature helps you solve problems with efficiency.',
    'Libra': 'As a Libra, you are diplomatic, fair-minded, and social. You approach life seeking harmony and balance. Your natural charm and sense of justice help you navigate relationships with grace.',
    'Scorpio': 'As a Scorpio, you are passionate, determined, and perceptive. You approach life with intensity and emotional depth. Your resourceful nature helps you transform challenges into opportunities.',
    'Sagittarius': 'As a Sagittarius, you are optimistic, freedom-loving, and philosophical. You approach life as an adventure and quest for meaning. Your open-minded nature embraces diverse experiences and ideas.',
    'Capricorn': 'As a Capricorn, you are responsible, disciplined, and ambitious. You approach life with practicality and determination. Your patient nature helps you climb to success through persistent effort.',
    'Aquarius': 'As an Aquarius, you are progressive, original, and humanitarian. You approach life with intellectual independence and vision. Your innovative nature helps you create positive change in the world.',
    'Pisces': 'As a Pisces, you are compassionate, artistic, and intuitive. You approach life with emotional sensitivity and imagination. Your gentle nature connects deeply with others and the unseen realms.'
  };
  return meanings[sign] || '';
};

const getChineseZodiacMeaning = (sign: string): string => {
  const meanings: {[key: string]: string} = {
    'Rat': 'As a Rat, you are quick-witted, resourceful, and versatile. You have natural charm and are generally popular with a wide circle of friends. Your intelligence and adaptability help you succeed in various situations.',
    'Ox': 'As an Ox, you are diligent, dependable, and determined. You value tradition and work steadily toward your goals. Your patient nature and strong work ethic lead to lasting achievements.',
    'Tiger': 'As a Tiger, you are brave, competitive, and unpredictable. You have natural authority and charm that draws others to you. Your courageous nature helps you overcome challenges with confidence.',
    'Rabbit': 'As a Rabbit, you are gentle, compassionate, and elegant. You value peace and harmony in your surroundings. Your diplomatic nature helps you navigate relationships with grace and sensitivity.',
    'Dragon': 'As a Dragon, you are energetic, charismatic, and confident. You have natural leadership qualities and inspire others. Your ambitious nature drives you to pursue grand goals with enthusiasm.',
    'Snake': 'As a Snake, you are wise, intuitive, and enigmatic. You have a philosophical mind and refined taste. Your perceptive nature helps you understand complex situations with clarity.',
    'Horse': 'As a Horse, you are energetic, independent, and adventurous. You have a free spirit and love for movement. Your enthusiastic nature helps you pursue diverse experiences with passion.',
    'Goat': 'As a Goat, you are gentle, creative, and compassionate. You have artistic sensibilities and value beauty. Your empathetic nature helps you connect with others on an emotional level.',
    'Monkey': 'As a Monkey, you are clever, curious, and versatile. You have natural intelligence and problem-solving abilities. Your quick-witted nature helps you adapt to changing circumstances with ease.',
    'Rooster': 'As a Rooster, you are observant, hardworking, and courageous. You have a keen eye for detail and strong principles. Your practical nature helps you organize your life with precision.',
    'Dog': 'As a Dog, you are loyal, honest, and protective. You value justice and stand up for your beliefs. Your faithful nature makes you a trusted friend and reliable partner.',
    'Pig': 'As a Pig, you are generous, diligent, and compassionate. You have a kind heart and enjoy life\'s pleasures. Your sincere nature creates genuine connections with others.'
  };
  return meanings[sign] || '';
};

const getChineseElement = (sign: string): string => {
  const elements: {[key: string]: string} = {
    'Rat': 'Water',
    'Ox': 'Earth',
    'Tiger': 'Wood',
    'Rabbit': 'Wood',
    'Dragon': 'Earth',
    'Snake': 'Fire',
    'Horse': 'Fire',
    'Goat': 'Earth',
    'Monkey': 'Metal',
    'Rooster': 'Metal',
    'Dog': 'Earth',
    'Pig': 'Water'
  };
  return elements[sign] || '';
};

const getChineseYinYang = (sign: string): string => {
  const yinYang: {[key: string]: string} = {
    'Rat': 'Yang',
    'Ox': 'Yin',
    'Tiger': 'Yang',
    'Rabbit': 'Yin',
    'Dragon': 'Yang',
    'Snake': 'Yin',
    'Horse': 'Yang',
    'Goat': 'Yin',
    'Monkey': 'Yang',
    'Rooster': 'Yin',
    'Dog': 'Yang',
    'Pig': 'Yin'
  };
  return yinYang[sign] || '';
};

const getChineseLuckyColors = (sign: string): string => {
  const colors: {[key: string]: string} = {
    'Rat': 'Blue, Gold',
    'Ox': 'White, Yellow',
    'Tiger': 'Blue, Gray',
    'Rabbit': 'Red, Pink',
    'Dragon': 'Gold, Silver',
    'Snake': 'Red, Yellow',
    'Horse': 'Yellow, Green',
    'Goat': 'Brown, Red',
    'Monkey': 'White, Blue',
    'Rooster': 'Gold, Brown',
    'Dog': 'Green, Red',
    'Pig': 'Yellow, Gray'
  };
  return colors[sign] || '';
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
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111827',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  tabText: {
    color: '#9ca3af',
    marginLeft: 4,
    fontSize: 14,
  },
  activeTabText: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabContent: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  numberCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 16,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  meaningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  meaningText: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  zodiacTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginVertical: 12,
  },
  zodiacDates: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 16,
  },
  traitContainer: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
  },
  traitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4b5563',
  },
  traitTitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  traitValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});

export default NumerologyScreen;
