import React, { Component, useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View, useAnimatedValue } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
//import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import * as geolib from 'geolib';
//import Toast from 'react-native-toast-message';
import Api from '/home/pedeai/workspace/projetos-apps/VouDeBike/src/services/api.js'
import axios from 'axios';
import BackgroundTimer from 'react-native-background-timer';
//import { SQLite,enablePromisse, openDatabase } from 'react-native-sqlite-storage';
import Modal from 'react-native-modal';
import { Button, TextInput } from 'react-native-paper';
import SQLiteManager from '../../database/SQLiteManager';
//import TreinoController from '../../controller/TreinoController';
//import Training from '../../services/sqlite/Training';

//SQLiteManager.initDB();
const App = () => {

  getAllTrainings = () => {
    const banco = new SQLiteManager();
    banco.all().then(lista => { setAllTrainingsList(lista) })
  }



  //let treinoController = new Training();
  function resetData() {
    setNomeTreino('');
    setTotalDistance(0);
    setMaxVelocity(0);
    setMediaVelocity(0);
    setCadencia(0);
    setCaloriasUser(0);
    setTimer(0);
    setRitmo(0);
  }

  storeTreino = (nomeTreino, coords, distanceTotalWay, mediaVelocity, maxVelocity, calorias, ritmo, cadencia, timer) => {
    const banco = new SQLiteManager();
    const dataAtual = new Date();
    const timestamp = Math.floor(dataAtual.getTime() / 1000);
    let auxCoords = [];
    let coordenadas = '';
    auxCoords = coords;


    if (!Number.isFinite(maxVelocity) || Number.isNaN(maxVelocity)) {
      maxVelocity = 0;
    }

    if (auxCoords.length > 2) {
      coordenadas = JSON.stringify(coords);
    } else {
      auxCoords = [[latitudeCity, longitudeCity]];
      coordenadas = JSON.stringify(auxCoords);
    }

    const obj = {
      nomeTreino: nomeTreino,
      coordenadas: coordenadas,
      distanceTotalWay: distanceTotalWay,
      mediaVelocity: mediaVelocity,
      maxVelocity: maxVelocity,
      calorias: calorias,
      ritmo: ritmo,
      cadencia: cadencia,
      timer: timer,
      dataAtual: timestamp
    }
    console.log('coordenadas: ', coordenadas);
    banco.create(obj).then(() => {
      Alert('Treino Salvo')
    })
      .catch(() => {
        Alert('Erro ao salvar treino');
      });

    setModalVisible(false);

    handlePlayPress();
  };

  let coords = [];
  let velocities = [];
  const [mediaVelocity, setMediaVelocity] = useState(0);
  const [maxVelocity, setMaxVelocity] = useState(0);
  const [weightUser, setWeightUser] = useState(0);
  const [aroBikeUser, setAroBike] = useState(0);
  const [tamRoda, setTamRoda] = useState(0);
  const [calorias, setCaloriasUser] = useState(0);
  const [ritmo, setRitmo] = useState(0);
  const [cadencia, setCadencia] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [nomeTreino, setNomeTreino] = useState('');
  const distanceTotalWay = 0;
  let dTotal = 0;
  const apiKey = 'AIzaSyA-kIb9c2QmpUCT-ry7_Sk5_LB4eiADFBg'
  const apiKeyOpenWeather = '5b8fafe39b6ce45add79cf815419956b'
  const [latitudeCity, setLatitudeCity] = useState("");
  const [longitudeCity, setLongitudeCity] = useState("");
  const [cityName, setCityName] = useState("");
  const [temperature, setCityTemperature] = useState("");
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0)
  //const [lastPosition, setLastPosition] = useState(null);
  const [playPressed, setPlayPressed] = useState(false);
  const [pausePressed, setPausePressed] = useState(false);
  const [stopPressed, setStopPressed] = useState(false);
  const [timer, setTimer] = useState(0);
  const [allTrainings, setAllTrainingsList] = useState([]);

  const showConfirmationModal = () => {
    setModalVisible(true);
  };

  function formatTime(current_time) {
    const hours = (Math.floor(current_time / 3600));
    current_time %= 3600;
    const minutes = (Math.floor(current_time / 60));
    const lastSeconds = (current_time % 60);

    const formatedHours = hours.toString().padStart(2, '0');
    const formatedMinutes = minutes.toString().padStart(2, '0');
    const formatedLastSeconds = lastSeconds.toString().padStart(2, '0');

    const formated = `${formatedHours}:${formatedMinutes}:${formatedLastSeconds}`;

    return formated;
  }

  getDay = (timestamp) => {
    const data = new Date(timestamp * 1000);

    const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

    const diaDaSemana = diasDaSemana[data.getDay()];

    return diaDaSemana;
  }

  dataFromWeekDay = (day) => {
    let flagNewestTraining = false;
    allTrainings.map((training, index) => {
      if (getDay(training.data) == day && !flagNewestTraining) {
        flagNewestTraining = true;
        setTotalDistance(training.distancia_total);
        setCaloriasUser(training.calorias);
        setRitmo(training.ritmo);
        setCadencia(training.cadencia);
        setTimer(training.tempo_total);
        setMediaVelocity(training.velocidade_media);
        setMaxVelocity(training.velocidade_maxima);
      }
    })
  }

  function getMediaVelocity(velocities) {
    if (velocities.length === 0) {
      return 0;
    }

    const soma = velocities.reduce((acumulator, valor) => acumulator + valor, 0);
    const media = (soma / velocities.length).toFixed(2);
    return (Number.isFinite(media) && !Number.isNaN(media)) ? media : 0;
  }

  function getCaloriasQueimadas(distanceTotalWay, mediaVelocity, maxVelocity, timer) {
    const velocidadeMediaMs = mediaVelocity / 3.6;
    //const velocidadeMaxMs = maxVelocity / 3.6;

    const MET = calcularMet(velocidadeMediaMs);

    const pesoKg = 80;
    const tempoHoras = timer / 60;
    const calorias = ((MET * pesoKg * tempoHoras) / 24).toFixed(2);

    return (Number.isFinite(calorias) && !Number.isNaN(calorias)) ? calorias : 0;
  }

  function calcularMet(velocity) {
    if (velocity < 10) {
      return 4.0;
    } else if (velocity < 20) {
      return 6.0;
    } else {
      return 8.0;
    }
  }

  function getRitmo(distanceTotalWay, timer) {
    const timeInMinutes = timer / 60;
    const ritmo = (timeInMinutes / distanceTotalWay).toFixed(2);

    return (Number.isFinite(ritmo) && !Number.isNaN(ritmo)) ? ritmo : 0;
  }

  function getCadencia(mediaVelocity, tamRoda) {
    const velocityMs = mediaVelocity / 3.6;
    const RPM = ((velocityMs * 60) / tamRoda).toFixed(2);

    return (Number.isFinite(RPM) && !Number.isNaN(RPM)) ? RPM : 0;
  }

  function convertAro(aroBikeUser) {
    const mapAros = {
      '26': 0.559,
      '24': 0.507,
    }

    if (mapAros.hasOwnProperty(aroBikeUser)) {
      const diametroMetros = mapAros[aroBikeUser];
      const comprimentoRodaMetros = 2 * Math.PI * (diametroMetros / 2);
      setTamRoda(comprimentoRodaMetros);
    } else {
      setTamRoda(1);
      //return 1; // Retorna 1 se o número do aro não for encontrado no mapeamento.
    }
  }

  Geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      coords.push({ latitude, longitude });
      setLatitudeCity(position.coords.latitude);
      setLongitudeCity(position.coords.longitude);
    },
    (error) => {
      console.warn(error.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );

  async function getCity() {
    try {
      const response = await Api.get(`json?latlng=${latitudeCity},${longitudeCity}&key=${apiKey}`)
      setCityName(response.data.results[0].address_components[3].long_name)
    } catch (error) {
      setCityName('Aguardando rede...');
      console.log("ERRO" + error)
    }
  }

  async function getTemperature() {
    try {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKeyOpenWeather}&units=metric`)
        .then((response) => {
          setCityTemperature((response.data.main.temp).toFixed(1));
        })
    } catch (error) {
      setCityTemperature('Aguardando rede...')
      console.error(error);
    }
  }

  const handlePlayPress = () => {
    resetData();
    toggleTracking();
    setPlayPressed(!playPressed);
  };

  const handlePausePress = () => {
    setPausePressed(!pausePressed);
    toggleTracking();
  };

  const handleStopPress = () => {
    //handlePlayPress();
  };

  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleTracking = () => {
    setTracking(!tracking);
  };

  getCity();
  getTemperature();

  useEffect(() => {
    let lastPosition = null;
    let intervalId;

    if (tracking) {
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setCoordinates((prevCoordinates) => [...prevCoordinates, { latitude, longitude }]);

          if (coords.length > 2) {
            distanceTotalWay = geolib.getPathLength(coords);
            setTotalDistance(distanceTotalWay);
            //getMediaVelocity(distanceTotalWay);
          }

          if (lastPosition) {
            const distance = geolib.getDistance(lastPosition, { latitude, longitude });

            dTotal += (distance / 1000);
            //setTotalDistance(dTotal);
          }
          lastPosition = { latitude, longitude };
        },
        (error) => console.error(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 }
      );

      intervalId = BackgroundTimer.setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      return () => {
        Geolocation.clearWatch(watchId);
        BackgroundTimer.clearInterval(intervalId);
      };
    }

    velocities.push((distanceTotalWay / timer).toFixed(2));
    setMediaVelocity(getMediaVelocity(velocities));
    setMaxVelocity(Math.max(...velocities));
    setCaloriasUser(getCaloriasQueimadas(distanceTotalWay, mediaVelocity, maxVelocity, timer));
    setRitmo(getRitmo(distanceTotalWay, timer));
    convertAro(26);
    setCadencia(getCadencia(mediaVelocity, tamRoda));
    getAllTrainings();
  }, [tracking]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "#1C2120" }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ paddingRight: 5 }}>
            <Icon name="location-on" size={25} color="white" />
          </View>
          <View>
            <Text style={styles.text}>{cityName}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 2 }}>
          <View style={{ paddingRight: 5 }}>
            <Icon name="thermostat" size={25} color="white" />
          </View>
          <View>
            <Text style={styles.text}>{temperature}º C</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: "#1C2120", alignItems: "center", height: 300, paddingTop: 8 }}>
        <Text style={{ color: 'white', fontSize: 20 }}>Hoje você pedalou</Text>
        <View style={{ padding: 20, justifyContent: "center", flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={{ fontSize: 100, color: "white" }}>{totalDistance.toFixed(2)}</Text>
          <Text style={{ fontSize: 36, color: "white" }}> Km</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.buttonWeek} onPress={() => dataFromWeekDay('Dom')}>
            <Text style={styles.textButtonWeek}>Dom</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonWeek} onPress={() => dataFromWeekDay('Seg')}>
            <Text style={styles.textButtonWeek}>Seg</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonWeek} onPress={() => dataFromWeekDay('Ter')}>
            <Text style={styles.textButtonWeek}>Ter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonWeek} onPress={() => dataFromWeekDay('Qua')}>
            <Text style={styles.textButtonWeek}>Qua</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonWeek} onPress={() => dataFromWeekDay('Qui')}>
            <Text style={styles.textButtonWeek}>Qui</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonWeek} onPress={() => dataFromWeekDay('Sex')}>
            <Text style={styles.textButtonWeek}>Sex</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonWeek} onPress={() => dataFromWeekDay('Sab')}>
            <Text style={styles.textButtonWeek}>Sáb</Text>
          </TouchableOpacity>
        </View>

        <View>
          {(!playPressed) ? (
            <TouchableOpacity onPress={handlePlayPress} style={styles.buttonPlay}>
              <Icon name='play-circle' size={80} color="#1C2120" />
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <View style={{ paddingRight: 30 }}>
                {/* {isVisible && ( */}
                <TouchableOpacity onPress={handlePausePress} style={styles.buttonPause}>
                  <Icon name={'pause-circle'} size={80} color="#1C2120" />
                </TouchableOpacity>
                {/* // <TouchableOpacity onPress={toggleTracking} style={styles.buttonPlay}>
                  //   <Icon name={'play-circle'} size={80} color="#1C2120"/>
                  // </TouchableOpacity> */}
                {/* )} */}

              </View>
              <View>
                <TouchableOpacity onPress={showConfirmationModal} style={styles.buttonStop}>
                  <Icon name='stop-circle' size={80} color="#1C2120" />
                </TouchableOpacity>
                <Modal isVisible={isModalVisible}>
                  <View style={styles.modalView}>
                    <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Salvar treino</Text>
                    </View>
                    <View style={{}}>
                      <TextInput
                        placeholder='Texto sem título'
                        value={nomeTreino}
                        onChangeText={(text) => setNomeTreino(text)}
                      />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 20 }}>
                      <Button title='Salvar' onPress={() => this.storeTreino(nomeTreino, coords, distanceTotalWay, mediaVelocity, maxVelocity, calorias, ritmo, cadencia, timer)} style={styles.buttonModalSave}><Text style={{ color: 'white' }}>Salvar</Text></Button>
                      <Button title='Cancelar' onPress={() => setModalVisible(false)} style={styles.buttonModalCancel}><Text style={{ color: 'white' }}>Cancelar</Text></Button>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          )}

        </View>

      </View>

      <View style={styles.homeScreen}>

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, backgroundColor: "#1C2120" }}>
            <View style={
              {
                flexDirection: "row",
                justifyContent: 'center',
                padding: 25,
                borderColor: '#FFF',
                borderTopWidth: 0.3,
                borderRightWidth: 0.3
              }
            }>
              <View style={{ paddingRight: 10 }}>
                <Icon name="bolt" size={20} color="white" />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.textTableTop}>Gasto Calorico </Text>
                <Text style={styles.textTableCell}>{calorias} Cal</Text>
              </View>
            </View>

            <View style={
              {
                flexDirection: "row",
                justifyContent: 'center',
                padding: 25,
                borderColor: '#FFF',
                borderTopWidth: 0.3,
                borderRightWidth: 0.3
              }
            }>
              <View style={{ paddingRight: 10 }}>
                <Icon name="monitor-heart" size={20} color="white" />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.textTableTop}>Ritmo</Text>
                <Text style={styles.textTableCell}>{(Number.isNaN(ritmo)) ? ritmo : 0} min/Km</Text>
              </View>
            </View>

            <View style={
              {
                flexDirection: "row",
                justifyContent: 'center',
                padding: 25,
                borderColor: '#FFF',
                borderTopWidth: 0.3,
                borderRightWidth: 0.3
              }
            }>
              <View style={{ paddingRight: 10 }}>
                <Icon name="pedal-bike" size={20} color="white" />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.textTableTop}>Cadência</Text>
                <Text style={styles.textTableCell}>{(Number.isNaN(cadencia)) ? cadencia : 0} RPM</Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1, backgroundColor: "#1C2120" }}>

            <View style={
              {
                flexDirection: "row",
                justifyContent: 'center',
                padding: 25,
                borderColor: '#FFF',
                borderTopWidth: 0.3
              }
            }>
              <View style={{ paddingRight: 10 }}>
                <Icon name="schedule" size={20} color="white" />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.textTableTop}>Tempo Total (H:m:s)</Text>
                <Text style={styles.textTableCell}>
                  {formatTime(timer)}
                </Text>
              </View>
            </View>

            <View style={
              {
                flexDirection: "row",
                justifyContent: 'center',
                padding: 25,
                borderColor: '#FFF',
                borderTopWidth: 0.3
              }
            }>
              <View style={{ paddingRight: 10 }}>
                <Icon name="speed" size={20} color="white" />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.textTableTop}>Vel. média</Text>
                <Text style={styles.textTableCell}>
                  {
                    (Number.isNaN(mediaVelocity)) ? mediaVelocity : '0'
                  } Km/h
                </Text>
              </View>
            </View>

            <View style={
              {
                flexDirection: "row",
                justifyContent: 'center',
                padding: 25,
                borderColor: '#FFF',
                borderTopWidth: 0.3
              }
            }>
              <View style={{ paddingRight: 10 }}>
                <Icon name="rocket" size={20} color="white" />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.textTableTop}>Vel. máx</Text>
                <Text style={styles.textTableCell}>{(velocities.length > 0) ? maxVelocity : '0'} Km/h</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
//}
export default App;

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

  buttonPause: {
    backgroundColor: "#62BA44",
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    borderRadius: 50,
  },

  buttonStop: {
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
  }
})