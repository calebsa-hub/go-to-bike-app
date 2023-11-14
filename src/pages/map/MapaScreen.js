import React, { Component, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import SQLiteManager from '../../database/SQLiteManager';
import Modal from 'react-native-modal';

export default class MapaScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listaTreinos: [],
      initialRegion: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      isModalVisible: false,
      idTreino: 0,
      nomeTreino: '',
      distanciaTotal: 0,
      tempoTotal: 0,
      calorias: 0,
      ritmo: 0,

    }
    this.getPosition();
    //this.listarTreinos();
  }

  componentDidMount() {
    this.listarTreinos();
  }

  listarTreinos = () => {
    const banco = new SQLiteManager();
    banco.all().then(lista => { this.setState({ listaTreinos: lista }) })
  }

  getPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.setState({ initialRegion: { latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } })
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  getData = (timestampString) => {
    const data = new Date(timestampString * 1000);
    //const data = new Date(timestampString);

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear()).slice(2);

    const dataFormatada = `${dia}/${mes}/${ano}`;

    return dataFormatada;
  }

  getHora = (timestampString) => {
    const data = new Date(timestampString * 1000);

    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    const segundo = String(data.getSeconds()).padStart(2, '0');
    const horarioFormatado = `${hora}h${minuto}m`;

    return horarioFormatado;
  }

  setTreinoName = (name) => {
    this.setState({ nomeTreino: name })
  }

  showModal = (id, nome_treino, distancia_total, tempo_total, ritmo, calorias) => {
    this.setState({
      idTreino: id,
      nomeTreino: nome_treino,
      distanciaTotal: distancia_total,
      tempoTotal: tempo_total,
      ritmo: ritmo,
      calorias: calorias,
      isModalVisible: true
    })
  }

  closeModal = () => {
    this.setState({ isModalVisible: false })
  }

  deleteTreino = () => {
    const banco = new SQLiteManager();
    banco.remove(this.state.idTreino).then(this.setState({ idTreino: 0 }))
    this.closeModal();
    this.listarTreinos();
  }

  updateNameTreino = () => {
    const banco = new SQLiteManager();
    banco.updateName(this.state.idTreino, this.state.nomeTreino)
    this.closeModal();
    this.listarTreinos();
  }

  render() {
    return (
      <View style={styles.containerPrincipal}>
        <View style={styles.containerMapa}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={this.state.initialRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            showsCompass={true}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
          >
            <Marker
              coordinate={{ latitude: this.state.initialRegion.latitude, longitude: this.state.initialRegion.longitude }}
              title="Minha Localização"
            />
          </MapView>
        </View>

        <View style={styles.containerOptions}>
          <TouchableOpacity style={{ paddingRight: 50 }}>
            <Icon name='shopping-bag' size={60} color='#FFF' />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name='build-circle' size={60} color='#FFF' />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ padding: 10, fontSize: 15, fontWeight: 'bold' }}>Seus treinos: </Text>
          <TouchableOpacity>
            <Text style={{ padding: 10, fontSize: 15, fontWeight: 'bold' }} onPress={() => this.listarTreinos()}>Atualizar</Text>
          </TouchableOpacity>
        </View>


        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.modalView}>
            <View style={{ alignItems: 'center', paddingBottom: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Treino selecionado</Text>
            </View>
            <View style={{}}>
              <TextInput
                placeholder={this.state.nomeTreino}
                // value={nomeTreino}
                onChangeText={(text) => this.setTreinoName(text)}
              />
            </View>
            <View>
              <View>
                <Text style={{ fontSize: 13, fontWeight: 'bold', paddingTop: 10, paddingLeft: 5 }}>{this.state.nomeTreino}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ padding: 5 }}>
                  <Text style={{ paddingBottom: 5 }}>Dist. Total: {this.state.distanciaTotal} Km</Text>
                  <Text>Tempo: {this.state.tempoTotal} s</Text>
                </View>
                <View style={{ padding: 5 }}>
                  <Text style={{ paddingBottom: 5 }}>Gasto calórico: {this.state.calorias} Cal</Text>
                  <Text>Ritmo: {this.state.ritmo} Km / min </Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 20 }}>
              <Button title='Salvar' onPress={() => this.updateNameTreino()} style={styles.buttonModalSave}><Text style={{ color: 'white' }}>Salvar</Text></Button>
              <Button title='Excluir' onPress={() => this.deleteTreino()} style={styles.buttonModalDelete}><Text style={{ color: 'white' }}>Excluir</Text></Button>
              <Button title='Cancelar' onPress={() => this.closeModal()} style={styles.buttonModalCancel}><Text style={{ color: 'white' }}>Voltar</Text></Button>
            </View>
          </View>
        </Modal>
        <View style={styles.containerHistory}>
          <ScrollView style={{ height: 300 }}>
            {(this.state.listaTreinos) ?
              (this.state.listaTreinos).map((training, index) => (
                <TouchableOpacity activeOpacity={0.7}>
                  <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderColor: 'white', paddingBottom: 5 }} key={index}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold', paddingHorizontal: 15 }}>{this.getData(training.data)}</Text>
                      <Text>({this.getHora(training.data)})</Text>
                    </View>
                    <View>
                      <View>
                        <Text style={{ fontSize: 13, fontWeight: 'bold', paddingTop: 10, paddingLeft: 5 }}>{training.nome_treino}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ padding: 5 }}>
                          <Text style={{ paddingBottom: 5 }}>Dist. Total: {training.distancia_total} Km</Text>
                          <Text>Tempo: {training.tempo_total}</Text>
                        </View>
                        <View style={{ padding: 5 }}>
                          <Text style={{ paddingBottom: 5 }}>Gasto calórico: {training.calorias} Cal</Text>
                          <Text>Ritmo: {training.ritmo} Km / min </Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                      <TouchableOpacity style={styles.buttonEdit} onPress={() => this.showModal(training.id, training.nome_treino, training.distancia_total, training.tempo_total, training.ritmo, training.calorias)}>
                        <Icon name='edit' size={25} color='#FFF' />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
              :
              <Text>Sem treinos por enquanto</Text>
            }
          </ScrollView>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: "black",
  },

  containerMapa: {
    backgroundColor: 'black',
    height: 300,
    borderColor: '#FFF',
    borderBottomWidth: 0.3,
  },

  containerOptions: {
    backgroundColor: 'black',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  containerHistory: {
    borderTopWidth: 0.3,
    borderColor: 'white',
  },

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

  modalView: {
    //margin: 20,
    backgroundColor: '#1C2120',
    borderRadius: 10,
    padding: 20,
    //justifyContent: 'space-beetwen',
    //alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  buttonModalSave: {
    backgroundColor: '#62BA44',
    borderRadius: 5,
    //paddind: 10,
  },

  buttonModalCancel: {
    backgroundColor: '#6C6B6B',
    borderRadius: 5,
    marginLeft: 20,
    //paddingLeft: 20,
  },

  buttonModalDelete: {
    backgroundColor: 'red',
    borderRadius: 5,
    marginLeft: 20,
  }, 

  buttonEdit: {
    backgroundColor: "#62BA44",
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: 50,
  }
})