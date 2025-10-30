import { View, StyleSheet, Image } from 'react-native';
import Text from './Text';
import theme from '../theme';

// Helper function to format large numbers
const formatCount = (count) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};

// Component for displaying repository statistics
const StatItem = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text fontWeight="bold" style={styles.statValue}>
      {formatCount(value)}
    </Text>
    <Text color="textSecondary" style={styles.statLabel}>
      {label}
    </Text>
  </View>
);

// Component for language tag
const LanguageTag = ({ language }) => (
  <View style={styles.languageTag}>
    <Text style={styles.languageText}>{language}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 5,
  },
  description: {
    marginBottom: 10,
  },
  languageContainer: {
    alignSelf: 'flex-start',
  },
  languageTag: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },
  languageText: {
    color: 'white',
    fontSize: theme.fontSizes.body,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
});

const RepositoryItem = ({ repository }) => {
  return (
    <View style={styles.container}>
      {/* Header with avatar and basic info */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: repository.ownerAvatarUrl }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text fontSize="subheading" fontWeight="bold" style={styles.title}>
            {repository.fullName}
          </Text>
          <Text color="textSecondary" style={styles.description}>
            {repository.description}
          </Text>
          <View style={styles.languageContainer}>
            <LanguageTag language={repository.language} />
          </View>
        </View>
      </View>
      
      {/* Statistics */}
      <View style={styles.statsContainer}>
        <StatItem label="Stars" value={repository.stargazersCount} />
        <StatItem label="Forks" value={repository.forksCount} />
        <StatItem label="Reviews" value={repository.reviewCount} />
        <StatItem label="Rating" value={repository.ratingAverage} />
      </View>
    </View>
  );
};

export default RepositoryItem;