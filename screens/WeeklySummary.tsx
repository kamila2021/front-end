import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import { getWeekDates, formatDate } from '../components/dateHelpers';
import Button from '../components/Button';

interface Entry {
    date: string;
    entryTime: string;
    exitTime: string;
    workerId: string;
}

const sampleData: Entry[] = [
    { date: '2024-05-27', entryTime: '08:00', exitTime: '17:00', workerId: '1' },
    { date: '2024-05-28', entryTime: '08:30', exitTime: '17:30', workerId: '1' },
    { date: '2024-05-29', entryTime: '09:00', exitTime: '18:00', workerId: '2' },
    { date: '2024-05-30', entryTime: '09:30', exitTime: '18:30', workerId: '2' },
    // Agrega más datos de ejemplo según sea necesario
];

const WeeklySummary = ({ navigation, workerId }: { navigation: any, workerId: any }) => {
    const { user } = workerId.params;
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [weekEntries, setWeekEntries] = useState<Entry[]>([]);

    useEffect(() => {
        fetchWeeklyEntries(currentWeek, user.id);
    }, [currentWeek, user]);

    const fetchWeeklyEntries = (week: Date, userId: string) => {
        const weekDates = getWeekDates(week);
        const entries = sampleData.filter(entry =>
            entry.workerId === userId && weekDates.includes(entry.date)
        );
        setWeekEntries(entries);
    };

    const handlePreviousWeek = () => {
        const previousWeek = new Date(currentWeek);
        previousWeek.setDate(currentWeek.getDate() - 7);
        setCurrentWeek(previousWeek);
    };

    const handleNextWeek = () => {
        const nextWeek = new Date(currentWeek);
        nextWeek.setDate(currentWeek.getDate() + 7);
        setCurrentWeek(nextWeek);
    };

    const renderEntry = ({ item }: { item: Entry }) => (
        <View style={{ marginBottom: 12, padding: 12, borderColor: COLORS.black, borderWidth: 1, borderRadius: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.black }}>
                {formatDate(item.date)}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.black }}>
                Entrada: {item.entryTime}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.black }}>
                Salida: {item.exitTime}
            </Text>
        </View>
    );

    const renderEmptyMessage = () => (
        <View style={{ marginVertical: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: COLORS.black }}>
                No hay registros para esta semana
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 12, color: COLORS.black }}>
                    Resumen Semanal
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Button title="Semana Anterior" onPress={handlePreviousWeek} filled />
                    <Button title="Semana Siguiente" onPress={handleNextWeek} filled />
                </View>
                <FlatList
                    data={weekEntries}
                    renderItem={renderEntry}
                    keyExtractor={(item) => item.date}
                    ListEmptyComponent={renderEmptyMessage}
                />
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.white,
                        paddingVertical: 12,
                        borderRadius: 8,
                        marginTop: 20,
                    }}
                >
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>Volver al inicio</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default WeeklySummary;
