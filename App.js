import React from 'react';
import { Dimensions, LogBox, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { initialize, requestPermission, getGrantedPermissions, readRecord, readRecords, revokeAllPermissions, getSdkStatus, aggregateRecord ,insertRecords} from 'react-native-health-connect';
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

  buttonContainer: {
    weight:200,
    flexDirection: 'row',
    display: 'flex',
  },
  button: {
    width:200,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button2: {
    margin:5,
    width: 100,
    height: 50,
    backgroundColor: 'blue',
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
  { accessType: 'write', recordType: 'Steps' },

  { accessType: 'read', recordType: 'Weight' },
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' },

];

const defaultStartTime='2024-06-01T12:00:00.000Z';
const defaultEndTime='2024-06-20T12:00:00.000Z';

class APP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
    this.initializeHealthConnect = this.initializeHealthConnect.bind(this);
    this.readGrantedPermissions = this.readGrantedPermissions.bind(this);
    this.writeSampleData = this.writeSampleData.bind(this);
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

  //寫入數據
  writeSampleData (type){
    const sampleData = [
      {
        recordType: 'Steps',
        startTime: '2024-05-10T12:00:00.405Z',
        endTime: '2024-05-10T12:15:00.405Z',
        count: 100,
      }
    ];

    insertRecords(sampleData).then((result) => {
      console.log('Inserted records1: ',JSON.stringify(result));
    });
  };

  //取得步數
  readSteps= ()=>{
    readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: defaultStartTime,
        endTime: defaultEndTime,
      },
    }).then((result) => {
      console.log('Steps: ',JSON.stringify(result));

    });
  };

  //取得血糖
  readBloodGlucose=() =>{

      readRecords('BloodGlucose', {
      timeRangeFilter: {
        operator: 'between',
        startTime: defaultStartTime,
        endTime: defaultEndTime,
      },
    }).then((result) => {
      console.log('BloodGlucose: ', JSON.stringify(result));

    });
  };

  //取得血壓
  readBloodPressure=()=>{
      readRecords('BloodPressure', {
      timeRangeFilter: {
        operator: 'between',
        startTime: defaultStartTime,
        endTime: defaultEndTime,
      },
    }).then((result) => {
      console.log('BloodPressure: ', JSON.stringify(result));

    });
  };

  //取得體重
  readWeight=()=> {
      readRecords('Weight', {
      timeRangeFilter: {
        operator: 'between',
        startTime: defaultStartTime,
        endTime: defaultEndTime,
      },
    }).then((result) => {
      console.log('Weight: ', JSON.stringify(result));

    });
  };

  //取得心率
  readHeartRate =() =>{

      readRecords('HeartRate', {
      timeRangeFilter: {
        operator: 'between',
        startTime: defaultStartTime,
        endTime: defaultEndTime,
      },
    }).then((result) => {
      console.log('HeartRate: ', JSON.stringify(result));

    });
  };

  //取得睡眠
  readSleep = ()=>{
      readRecords('SleepSession', {
      timeRangeFilter: {
        operator: 'between',
        startTime: defaultStartTime,
        endTime: defaultEndTime,
      },
    }).then((result) => {
      console.log('Sleep: ', JSON.stringify(result));

    });
  };

  //取得數據by id

  readSampleDataSingle = () => {
    readRecord(
      'Steps',
      '5fa6a23c-e36f-482e-9e27-3dcda6ad8dc6'
      // '1b649c92-aa6c-402e-b137-ea388c8e67e7'
    ).then((result) => {
      console.log('Retrieved record: ', JSON.stringify({ result }, null, 2));
    });
  };

  //取得聚合數據
  //google限定授權取得前30天的步數
  async aggregateRecord(){
    readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: '2024-05-01T12:00:00.405Z',
        endTime: '2024-05-10T12:00:00.405Z',
      },
    }).then((stepData) => {

      const hourlySteps = {};

      stepData.forEach(record => {
        const startTime = new Date(record.startTime);
        const endTime = new Date(record.endTime);

        let currentHour = new Date(startTime);
        currentHour.setMinutes(0, 0, 0); // 設置為整點小時

        while (currentHour <= endTime) {
          const nextHour = new Date(currentHour);
          nextHour.setHours(nextHour.getHours() + 1);

          const start = currentHour < startTime ? startTime : currentHour;
          const end = nextHour > endTime ? endTime : nextHour;

          const duration = (end - start) / 1000 / 60 / 60; // 時間差（小時）
          const countInHour = (record.count * duration) / ((endTime - startTime) / 1000 / 60 / 60);

          const hourString = currentHour.toISOString();
          if (!hourlySteps[hourString]) {
            hourlySteps[hourString] = 0;
          }
          hourlySteps[hourString] += countInHour;

          currentHour = nextHour;
        }
      });

      const result = Object.entries(hourlySteps).map(([recordDateTime, count]) => ({
        recordDateTime: new Date(recordDateTime).getTime()/1000,
        count: Math.round(count) // 可選：將步數取整
      }));

      console.log(result);


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


          <TouchableOpacity style={styles.button} onPress={this.getSdkStatus}>
            <Text style={styles.text}>getSdkStatus</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.readGrantedPermissions}>
            <Text style={styles.text}>current Permissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.writeSampleData}>
            <Text style={styles.text}>writeSampleData</Text>
          </TouchableOpacity>

          <View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button2} onPress={this.readSteps}>
                <Text style={styles.text}>Steps</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={this.readBloodGlucose}>
                <Text style={styles.text}>Blood</Text>
                <Text style={styles.text}>Glucose</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={this.readBloodPressure}>
                <Text style={styles.text}>Blood</Text>
                <Text style={styles.text}>Pressure</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button2} onPress={this.readWeight}>
                <Text style={styles.text}>Weight</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={this.readSleep}>
                <Text style={styles.text}>Sleep</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={this.readHeartRate}>
                <Text style={styles.text}>HeartRate</Text>
              </TouchableOpacity>
            </View>
          </View>


          <TouchableOpacity style={styles.button} onPress={this.readSampleDataSingle}>
            <Text style={styles.text}>readSampleDataSingle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.aggregateRecord}>
            <Text style={styles.text}>aggregateRecord</Text>
          </TouchableOpacity>
        </View>
      );
  }
}

export default APP;
