import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import theme from '../theme';
import AppBarTab from './AppBarTab';
import useSignedInUser from '../hooks/useSignedInUser';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appbar,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  scrollView: {
    flexDirection: 'row',
  },
});

const AppBar = () => {
  const { isSignedIn } = useSignedInUser();
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} contentContainerStyle={styles.scrollView}>
        <AppBarTab text="Repositories" url={"/"} />
        {isSignedIn && <AppBarTab text="Create a review" url={"/create-review"} />}
        {isSignedIn ? (
          <AppBarTab text="Logout" url={"/logout"} />
        ) : (
          <>
            <AppBarTab text="Sign Up" url={"/signup"} />
            <AppBarTab text="Login" url={"/login"} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;