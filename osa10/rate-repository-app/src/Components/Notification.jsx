import { View, StyleSheet } from 'react-native';
import { useNotification } from '../contexts/NotificationContext';
import Text from './Text';
import theme from '../theme';

const NotificationBar = () => {
    const { notification } = useNotification();
    
    if (!notification || !notification.message) return null;
    
    const { message, type } = notification;
    const styles = StyleSheet.create({
        container: {
            padding: 16,
            margin: 8,
            borderRadius: 4,
            textAlign: 'center',
        },
        error: {
            backgroundColor: theme.colors.error,
            borderColor: theme.colors.errorText,
            borderWidth: 1,
        },
        success: {
            backgroundColor: theme.colors.success,
            borderColor: theme.colors.successDark,
            borderWidth: 1,
        },
        text: {
            textAlign: 'center',
            color: theme.colors.errorText,
        },
    });
    const containerStyle = [
        styles.container,
        type === 'error' ? styles.error : styles.success
    ];

    return (
        <View style={containerStyle}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

export default NotificationBar;