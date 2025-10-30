import { Pressable, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';
import Text from './Text';

const styles = StyleSheet.create({
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tabText: {
    color: 'white',
    fontSize: 16,
  },
});

const AppBarTab = ({ text, url }) => {
  const navigate = useNavigate();

  return (
    <Pressable style={styles.tab} onPress={() => navigate(url)}>
      <Text style={styles.tabText} fontWeight="bold">{text}</Text>
    </Pressable>
  );
};

export default AppBarTab;
