import { View, StyleSheet, Image, Pressable } from 'react-native';
import * as Linking from 'expo-linking';
import Text from './Text';
import theme from '../theme';
import { formatCount } from '../utils/formatting';

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

const GitHubButton = ({ url }) => {
  const handlePress = () => {
    Linking.openURL(url);
  };

  return (
    <Pressable style={styles.githubButton} onPress={handlePress}>
      <Text style={styles.githubButtonText} fontWeight="bold">
        Open in GitHub
      </Text>
    </Pressable>
  );
};

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
  githubButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  githubButtonText: {
    color: 'white',
    fontSize: theme.fontSizes.subheading,
  },
});

const RepositoryItem = ({ repository, showGitHubButton = false }) => {
  return (
    <View testID="repositoryItem" style={styles.container}>
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
      
      <View style={styles.statsContainer}>
        <StatItem label="Stars" value={repository.stargazersCount} />
        <StatItem label="Forks" value={repository.forksCount} />
        <StatItem label="Reviews" value={repository.reviewCount} />
        <StatItem label="Rating" value={repository.ratingAverage} />
      </View>
      {showGitHubButton && repository.url && (
        <GitHubButton url={repository.url} />
      )}
    </View>
  );
};

export default RepositoryItem;