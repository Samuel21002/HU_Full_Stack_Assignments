import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import theme from '../theme';

const RepositoryResultsFilter = ({ filter, onFilterChange }) => {
    const handleTypePress = (type) => {
        const newFilter = { ...filter, Type: type };
        onFilterChange(newFilter);
    };

    const handleSortByPress = (sortBy) => {
        const newFilter = { ...filter, SortBy: sortBy };
        onFilterChange(newFilter);
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Pressable
                    style={[styles.button, filter.Type === 'CREATED_AT' && styles.selected]}
                    onPress={() => handleTypePress('CREATED_AT')}
                >
                    <Text style={styles.text}>Most Recent</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, filter.Type === 'RATING_AVERAGE' && styles.selected]}
                    onPress={() => handleTypePress('RATING_AVERAGE')}
                >
                    <Text style={styles.text}>Most Popular</Text>
                </Pressable>
            </View>
            <View style={styles.rightContainer}>
                <Pressable
                    style={[styles.button, filter.SortBy === 'ASC' && styles.selected]}
                    onPress={() => handleSortByPress('ASC')}
                >
                    <Text style={styles.text}>Ascending</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, filter.SortBy === 'DESC' && styles.selected]}
                    onPress={() => handleSortByPress('DESC')}
                >
                    <Text style={styles.text}>Descending</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    leftContainer: {
        flexDirection: 'row',
    },
    rightContainer: {
        flexDirection: 'row',
    },
    button: {
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    selected: {
        backgroundColor: theme.colors.primary,
    },
    text: {
        color: theme.colors.textPrimaryLight,
    },
});

export default RepositoryResultsFilter;