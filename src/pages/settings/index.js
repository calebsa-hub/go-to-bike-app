import React, {Component} from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class History extends Component{
  render(){
    return(
      <View>
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: { 
    color: "white"
  },

  homeScreen: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: "red"
  },

  mapScreen: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: "#1C2120"
  },

  historyScreen: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: "#1C2120"
  },
  
  container: {
    padding: 15,
  },

  tableHeader: {
    backgroundColor: '#DCDCDC',
  },

  buttonPlay: {
    backgroundColor: "#62BA44",
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    borderRadius: 50,
  },

  buttonWeek: {
    backgroundColor: "#62BA44",
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: 50,
  },

  textButtonWeek: {
    color: "#FFFFFF",
    fontSize: 16,
    //fontWeight: "bold",
    alignSelf: "center"
  },

  textTableTop: {
    color: "#FFF",
    //fontWeight: 'bold',
    fontSize: 16,
  },

  textTableCell: {
    color: "#FFF",
    fontSize: 19,
    paddingTop: 10,
    fontWeight: 'bold'
  },
})