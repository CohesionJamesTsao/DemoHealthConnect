import React from 'react';
import { Dimensions, LogBox, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { initialize, requestPermission, getGrantedPermissions, readRecords, revokeAllPermissions, getSdkStatus, aggregateRecord } from 'react-native-health-connect';
const { width, height } = Dimensions.get('window');
LogBox.ignoreAllLogs();

const styles = StyleSheet.create({
  bgContainer: {
    backgroundColor: 'yellow',
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
});
//初始化

const initializeHealthConnect = async () => {
  const isInitialized = await initialize();
  console.log({ isInitialized });
};

const permissions = [
  { accessType: 'read', recordType: 'BloodGlucose' },
  { accessType: 'read', recordType: 'BloodPressure' },
  { accessType: 'read', recordType: 'HeartRate' },
  { accessType: 'read', recordType: 'SleepSession' },
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'read', recordType: 'Weight' },
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' },

];

class APP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
    this.initializeHealthConnect = this.initializeHealthConnect.bind(this);
    this.readGrantedPermissions = this.readGrantedPermissions.bind(this);
    this.readSampleData = this.readSampleData.bind(this);
    this.requestPermissions2=this.requestPermissions2.bind(this);
    this.getSdkStatus=this.getSdkStatus.bind(this);
    this.aggregateRecord=this.aggregateRecord.bind(this);


    
  }

  

  //檢查權限
  readGrantedPermissions (){
    getGrantedPermissions().then((permissions) => {
      console.log('Granted permissions ', permissions);

    });
  };

  //取得數據
  readSampleData (type){
    // readRecords('Steps', {
    // readRecords('ActiveCaloriesBurned', {
    readRecords('BloodGlucose', {
    // readRecords('BloodPressure', {
    // readRecords('Weight', {
    // readRecords('SleepSession', {
    // readRecords('HeartRate', {
      timeRangeFilter: {
        operator: 'between',
        startTime: '2023-01-09T12:00:00.405Z',
        endTime: '2024-07-01T23:53:15.405Z',
      },
    }).then((result) => {
      console.log('Retrieved records1: ',JSON.stringify(result));

    });
  };
  //取得聚合數據
  aggregateRecord(){
    aggregateRecord({
      recordType: 'BloodGlucose',
      timeRangeFilter: {
        operator: 'between',
        startTime: '2024-06-12T00:00:00.000Z',
        endTime: '2024-07-01T23:53:15.405Z',
      },
    }).then((result) => {
      console.log('Aggregated records: ', result); // Aggregated records:  {"result":{"totalSteps":10000,"totalDistance":10000,"totalEnergy":{"inCalories":15000000,"inJoules":62760000.00989097,"inKilojoules":62760.00000989097,"inKilocalories":15000}}}
    });
  }

  async componentDidMount() {
    initializeHealthConnect();
  }

  async initializeHealthConnect (){
    const isInitialized = await initialize();
    console.log({ isInitialized });
  };


  async requestPermissions2() {
    requestPermission(permissions)
      .then(grantedPermissions => {
        console.log('Granted permissions1:', grantedPermissions);
      })
      .catch(error => {
        console.error('Error requesting permissions:', error);
      });
  }

  async getSdkStatus() {
    getSdkStatus().then((status) => {
      console.log('SDK status:', status);
    });
  }
  
  render() {
      return (
        <View style={styles.bgContainer}>
          <TouchableOpacity style={styles.button} onPress={this.initializeHealthConnect}>
            <Text style={styles.text}>initialize</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.requestPermissions2}>
            <Text style={styles.text}>Request Permissions2</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={revokeAllPermissions}>
            <Text style={styles.text}>revokePermissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.getSdkStatus}>
            <Text style={styles.text}>getSdkStatus</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.readGrantedPermissions}>
            <Text style={styles.text}>current Permissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.readSampleData}>
            <Text style={styles.text}>readSampleData</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.aggregateRecord}>
            <Text style={styles.text}>aggregateRecord</Text>
          </TouchableOpacity>
        </View>
      );
  }
}

export default APP;
