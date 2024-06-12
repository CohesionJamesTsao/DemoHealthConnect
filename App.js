import React from 'react';
import { Dimensions, LogBox, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { initialize, requestPermission, getGrantedPermissions, readRecords, revokeAllPermissions } from 'react-native-health-connect';
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
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' }

];

class APP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
    this.readGrantedPermissions = this.readGrantedPermissions.bind(this);
    this.readSampleData = this.readSampleData.bind(this);
    this.requestPermissions2=this.requestPermissions2.bind(this);
    this.revokeAllPermissions = this.revokeAllPermissions.bind(this);
    
  }

  

  //檢查權限
  readGrantedPermissions (){
    getGrantedPermissions().then((permissions) => {
      console.log('Granted permissions ', permissions.length);

    });
  };

  //取得數據
  readSampleData (){
    readRecords('ActiveCaloriesBurned', {
      timeRangeFilter: {
        operator: 'between',
        startTime: '2023-01-09T12:00:00.405Z',
        endTime: '2024-07-01T23:53:15.405Z',
      },
    }).then((result) => {
      console.log('Retrieved records: ', JSON.stringify({ result }, null, 2)); // Retrieved records:  {"result":[{"startTime":"2023-01-09T12:00:00.405Z","endTime":"2023-01-09T23:53:15.405Z","energy":{"inCalories":15000000,"inJoules":62760000.00989097,"inKilojoules":62760.00000989097,"inKilocalories":15000},"metadata":{"id":"239a8cfd-990d-42fc-bffc-c494b829e8e1","lastModifiedTime":"2023-01-17T21:06:23.335Z","clientRecordId":null,"dataOrigin":"com.healthconnectexample","clientRecordVersion":0,"device":0}}]}
    });
  };

  async componentDidMount() {
    initializeHealthConnect();
    // requestPermissions();
  }


  async requestPermissions2() {
    requestPermission(permissions)
      .then(grantedPermissions => {
        console.log('Granted permissions1:', grantedPermissions);
      })
      .catch(error => {
        console.error('Error requesting permissions:', error);
      });
  }
  
  render() {
      return (
        <View style={styles.bgContainer}>
          <TouchableOpacity style={styles.button} onPress={this.requestPermissions2}>
            <Text style={styles.text}>Request Permissions2</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={revokeAllPermissions}>
            <Text style={styles.text}>revokePermissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.readGrantedPermissions}>
            <Text style={styles.text}>current Permissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.readSampleData}>
            <Text style={styles.text}>calories</Text>
          </TouchableOpacity>
        </View>
      );
  }
}

export default APP;
