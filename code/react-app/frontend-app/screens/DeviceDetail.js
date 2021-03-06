import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  View, Text, StyleSheet,
  ScrollView, Dimensions,
  Image, Platform, Linking,
  TextInput, TouchableOpacity,
  FlatList, TouchableWithoutFeedback
} from 'react-native';
import { MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import * as EVENT from '../apis/event';
import { cloneDeep, pick } from 'lodash';
import * as eventName from '../constants/Event';
import * as asyncStorage from '../constants/localStorage';
import { AsyncStorage } from 'react-native';
import * as authenticationActionCreators from '../actions/authentication';
import requestApi from '../utilities/request';
import * as HOME_API from '../apis/home';
import { general } from '../constants/general';


const { heigh, width } = Dimensions.get('window');

class DeviceDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      dataObject: {},
      user: {},
      image: 'a',
      distance: '',
      dataSameShop: []
    };
  }
  componentDidMount() {
    const data = this.props.navigation.getParam('data', 'some default value');
    this.setState({
      distance: data.distance
    })
    console.log("------------------------id------------------------");
    this.getData(data.list_id);
    this.getSameShopItemList();
    this.getUser();
  }

  getData = (id) => {
    let api = cloneDeep(HOME_API.getItemDetail);
    api.url = api.url + '?list_id=' + id;
    requestApi(api).then(async data => {
      let jsonData = await data.json();
      this.setState({
        dataObject: jsonData.ad,
        image: jsonData.ad.images[0]
      })
    })
      .catch(error => {
        console.log('error');
      })
  }

  getSameShopItemList = () => {
    let api = cloneDeep(HOME_API.getItem);
    api.url = api.url + "?limit=4&o=" + general.page.offset + "&distance=" + general.page.distance;
    requestApi(api)
      .then(async (data) => {
        const jsonData = await data.json();
        this.setState({ dataSameShop: jsonData });
        // this.setLoading(false)
      })
      .catch(error => {
        console.log(error);
      })
  }

  getUser = async () => {
    try {
      const user = await AsyncStorage.getItem(asyncStorage.USER);
      const userObj = JSON.parse(user);
      this.setState({
        user: userObj
      });
      console.log('user', user);
    } catch (error) {
      console.log(error.message);
    }
  }

  saveEvent = (ad_id, eventName) => {
    const userId = this.props.state.authentication.userId;
    let api = cloneDeep(EVENT.creatEvent);
    api.request.body = JSON.stringify({
      ad_id: ad_id,
      user_fingerprint: userId,
      event_name: eventName,
    });

    requestApi(api).then(async (data) => {
      let jsonData = await data.json();
      console.log(data);
    })
      .catch((error) => {
        console.log(error);
      })
  }
  eventCall = phone => {
    // console.log('callNumber ----> ', `0`+phone);
    const sdt = `0` + phone;
    //console.log('callNumber ----> ', sdt);
    let phoneNumber = ' ';
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${sdt}`;
    }
    else {
      phoneNumber = `tel:${sdt}`;
    }
    Linking.openURL(phoneNumber)
    console.log(sdt);
    this.saveEvent(phone, eventName.CALL_CLICK);
  };

  eventSendSMS = (ad_id) => {
    console.log(ad_id);
    this.saveEvent(ad_id, eventName.SMS_CLICK);
  }

  eventChat = (ad_id) => {
    console.log(ad_id);
    this.saveEvent(ad_id, eventName.CHAT_CLICK);
  }

  renderList = ({ item }) => {
    return (
      <TouchableWithoutFeedback key={item.ad_id}>
        <View style={styles.containItem}>
          <Image style={styles.image} source={{ uri: item.image }}></Image>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode={"tail"}>{item.subject}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.itemPrice} numberOfLines={1} ellipsizeMode={"tail"}>{item.price_string}</Text>
            <Text style={item.tag_rate_New ? styles.percent : { display: "none" }}>{item.tag_rate_New}</Text>
          </View>
          <View style={styles.containSmallText}>
            <Text style={styles.smalltext}>{item.date}</Text>
            <Text style={styles.smalltext}> | </Text>
            <Text style={styles.smalltext, { color: "#ffa100", fontSize: 11 }}>{item.distance} km</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )

  }

  render() {
    return (
      <ScrollView style={styles.container}>

        <Image style={styles.styleImage}
          source={{ uri: this.state.image }} resizeMode="stretch" >
        </Image>

        <View style={styles.styleViewName}>
          <Text style={styles.styleName}>{this.state.dataObject.subject}</Text>
          <View style={styles.styleViewOfPrice}>
            <View style={styles.stylePrice_Time}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.stylePrice}>{this.state.dataObject.price_string}</Text>
                <Text style={this.state.dataObject.tag_rate_New ? styles.percent : { display: "none" }}>{this.state.dataObject.tag_rate_New}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.styleTime}>{this.state.dataObject.date}</Text>
                <Text style={styles.styleTime}> | {this.state.distance} km</Text>
              </View>
            </View>
            <View style={{ flex: 0.3, justifyContent: 'flex-end' }}>
              <TouchableOpacity style={styles.styleButton}>
                <Text style={{ fontSize: 15, marginRight: 5, color: 'red' }}>Lưu tin</Text>
                <MaterialCommunityIcons name="heart-outline" size={18} color={'red'}>
                </MaterialCommunityIcons>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ height: 0.7, backgroundColor: 'gray', marginTop: 5 }}></View>
        <View style={styles.containInfo}>
          <View style={styles.styleStatus}>
            <Text style={{ fontSize: 16, color: 'gray' }}>Trạng thái: </Text>
            <Text style={{ fontSize: 16, color: 'blue' }}>  {this.state.dataObject.condition_ad_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ fontSize: 16, color: 'gray' }} numberOfLines={2} ellipsizeMode={"tail"}>Địa điểm: </Text>
            <Text style={{ fontSize: 16, color: 'black' }}>{this.state.dataObject.ward_name},{this.state.dataObject.area_name},{this.state.dataObject.region_name}.</Text>
          </View>
        </View>
        <View style={{ height: 0.7, backgroundColor: 'gray', marginTop: 5 }}></View>
        <View style={styles.stylePerson}>
          <Image style={styles.styleImagePic} source={{ uri: this.state.dataObject.avatar }} resizeMode="stretch">
          </Image>
          <View>
            <Text style={styles.styleName} numberOfLines={2} ellipsizeMode={"tail"}>{this.state.dataObject.account_name}</Text>
            <View style={styles.containBtn}>
              <TouchableOpacity style={styles.btn} onPress={() => this.eventCall(this.state.dataObject.ad_id)}>
                <Feather name="phone-call" size={25} color="#fff"></Feather>
                <Text style={styles.textBtn}>Gọi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => this.eventSendSMS(this.state.dataObject.ad_id)}>
                <Feather name="message-circle" size={25} color="#fff"></Feather>
                <Text style={styles.textBtn}>SMS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => this.eventChat(this.state.dataObject.ad_id)}>
                <Entypo name="chat" size={25} color="#fff"></Entypo>
                <Text style={styles.textBtn}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ height: 0.7, backgroundColor: 'gray' }}></View>

        <View style={styles.styleDescription}>
          {/* <Text style={{ fontSize: 16, color: 'gray' }}>Trạng thái:
              <Text style={{ marginLeft: 5, fontSize: 16, color: 'black' }}>  {this.state.dataObject.condition_ad_name}</Text>
          </Text>
          <Text style={{ fontSize: 16, color: 'gray' }} numberOfLines={2} ellipsizeMode={"tail"}>
            Địa điểm: </Text>
          <Text style={{ marginLeft: 5, fontSize: 16, color: 'black' }}>
            {this.state.dataObject.ward_name},{this.state.dataObject.area_name},
                                {this.state.dataObject.region_name}</Text> */}

          <Text style={{ fontSize: 18, color: 'gray' }}>Thông tin sản phẩm:</Text>
          <Text style={styles.styleBody}>{this.state.dataObject.body}</Text>
        </View>
        <View style={styles.viewFlatHome}>
          <View style={styles.headerGroup}>
            <Text style={styles.header}>Sản phẩm khác của người bán</Text>
            {/* <TouchableOpacity onPress={() => this.onPressLink(0)}>
              <Text style={styles.link}>Xem thêm</Text>
            </TouchableOpacity> */}
          </View>
          {/* <View style={{ flex: 0.05, marginTop: 2, height: 1, backgroundColor: '#ffa100' }}></View> */}
          <FlatList
            data={this.state.dataSameShop.ads}
            renderItem={this.renderList}
            keyExtractor={item => item.ad_id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    );
  }

};

DeviceDetail.navigationOptions = {
  //title: 'information details',
  headerStyle: {
    backgroundColor: "#ffba00",
  },
  tabBarVisible: false,
};

const styles = StyleSheet.create({
  container: {
    //   flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: "#F8F8FF",
  },
  styleImage: {
    width: width,
    height: width,
  },
  styleViewName: {
    // height: 110,
    flexDirection: 'column',
    backgroundColor: "#fff",
    // marginTop: 7,
    // marginBottom: 7,
    // marginLeft: 7,
    // marginRight: 7,
    padding: 5
  },
  // styleName: {
  //   //flex:0.5,
  //   fontWeight: "bold",
  //   fontSize: 20,
  //   paddingBottom: 5
  // color: '#645DAC',
  // },
  styleName: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 5,
    color: 'black',
    justifyContent: 'center',
  },
  stylePrice_Time: {
    flexDirection: 'column',
  },
  styleViewOfPrice: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stylePrice: {
    // flex: 0.5,
    fontSize: 18,
    color: 'red',
    paddingBottom: 5
  },
  styleViewInfo: {
    flexDirection: 'column',
    backgroundColor: "#fff",
    // marginTop:7,
    // marginBottom: 7,
    // marginLeft: 7,
    // marginRight: 7,
    padding: 5
  },

  styleTime: {
    fontSize: 12,
    color: 'gray',
  },
  styleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'red',
    width: 80,
    borderRadius: 9,
    // paddingHorizontal:4
    // height: 7,
  },
  infor: {
    flexDirection: 'column',
  },
  styleBody: {
    marginLeft: 4,
    marginTop: 3,
    marginRight: 4,
  },
  styleStatus: {
    flexDirection: 'row',
    paddingBottom: 5
  },
  containInfo: {
    padding: 5
  },
  stylePerson: {
    flex: 0.5,
    flexDirection: 'row',
    backgroundColor: "#fff",
    // marginTop:7,
    // marginBottom: 7,
    // marginLeft: 7,
    // marginRight: 7,
    padding: 5
  },
  // styleButton: {
  //   flex: 0.5,
  //   flexDirection: 'row',
  // },
  styleImagePic: {
    width: 80,
    height: 80,
    borderRadius: 15,
    justifyContent: 'flex-start',
    marginRight: 5
  },

  styleDescription: {
    backgroundColor: "#fff",
    // marginTop:7,
    // marginBottom: 7,
    // marginLeft: 7,
    // marginRight: 7,
    padding: 5
  },
  containBtn: {
    flexDirection: "row",
    // justifyContent: "space-between",
    height: 20,
    paddingHorizontal: 5,
    marginTop: 7,
    marginBottom: 20,
    // zIndex: 10000
  },
  btn: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    width: "27%",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 8
  },
  textBtn: {
    color: "#fff",
    fontWeight: "bold",
    paddingLeft: 4
  },
  row: {
    flexDirection: "row"
  },
  percent: {
    fontSize: 10,
    color: "#008ae6",
    borderColor: "#008ae6",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 1,
    marginLeft: 5,
    borderRadius: 5,
    height: 18
  },
  image: {
    borderRadius: 4,
    width: 100,
    height: 120
  },
  containItem: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    marginHorizontal: 10,
    marginBottom: 15
  },
  headerGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10
  },
  header: {
    // color:"blue",
    fontWeight: "bold",
    paddingTop: 5,
    paddingBottom: 15
  },
  link: {
    color: "#ffa100",
    paddingTop: 5,
    paddingBottom: 10
  },
  itemName: {
    paddingVertical: 5,
    textAlign: "center"
  },
  itemPrice: {
    color: "red"
  },
  viewFlatHome: {
    flex: 6,
    margin: 7,
    borderRadius: 14,
    // borderBottomWidth: 3,
    // borderTopWidth:3,
    // borderColor: '#ffba00',


    elevation: 5, // Android
    shadowColor: '#CFD8DC', // iOS
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    backgroundColor: '#fff'
  },
  containSmallText: {
    flexDirection: "row",
    marginTop: 3
  },
  smalltext: {
    fontSize: 11,
    color: "#8c8c8c"
  }
});

const mapStateToProps = (state) => {
  return { state: pick(state, ['authentication']) }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchAuthentication: bindActionCreators(authenticationActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceDetail);