import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Switch, ScrollView } from 'react-native';
import { useTheme } from '../../../ThemeContext';

const SettingsScreen = () => {

  const { isDarkMode, toggleTheme } = useTheme();

  const containerSettingsTheme = {
    ...styles.containerSettings,
    borderColor: isDarkMode ? 'white' : '#62BA44'
  }

  const textSettingsTheme = {
    ...styles.textSettings,
    color: isDarkMode ? 'white' : '#62BA44',
  }

  const textoRodapeTheme = {
    ...styles.textRodape,
    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0, 0, 0, 0.5)',
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? 'black' : 'white' }}>
      <ScrollView>
        <View style={containerSettingsTheme}>
          <Text style={textSettingsTheme}>
            Alternar para {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          </Text>

          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>
        <TouchableOpacity>
          <View style={containerSettingsTheme}>
            <Text style={textSettingsTheme}>Idioma</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={containerSettingsTheme}>
            <Text style={textSettingsTheme}>Sobre</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.rodape}>
        <Text style={textoRodapeTheme}>Vou de Bike</Text>
        <Text style={textoRodapeTheme}>v1.0.0</Text>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  containerSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    padding: 20,
    borderBottomWidth: 0.5,
  },

  textSettings: {
    fontSize: 16,
    fontWeight: '600',
  },

  rodape: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },

  textRodape: {
    fontSize: 12,
  },
})