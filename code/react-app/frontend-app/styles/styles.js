import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
  },
  contain_search: {
    flex: 0.1,
    width: "100%",
    backgroundColor: "#ffba00",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 5
  },
  input_search: {
    borderRadius: 10,
    height: 30,
    width: "80%",
    borderWidth: 1,
    borderColor: "white",
    marginVertical: 25,
    paddingHorizontal: 10,
    backgroundColor: "white"
  },
  logo: {
    color: "white",
    fontWeight: "bold",
    width: "10%",
    paddingTop: 20,
    paddingHorizontal: 5
  },
  icon: {
    marginTop: 25,
    marginLeft: 8
  },
  containBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#fff",
    borderRadius: 15,
    borderStyle: "solid",
    backgroundColor: "#FFE399",
    width: 105,
    height: 35,
    marginHorizontal: 8,
    marginTop: 10
  },
  activeBtn: {
    backgroundColor: "#ffa100"
  },
  textBtn: {
    paddingHorizontal: 10
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
  },
  percent: {
    fontSize: 10,
    color: "#008ae6",
    borderColor: "#008ae6",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 1,
    marginLeft: 5,
    borderRadius: 5
  },

  containerNoti: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 15,
    backgroundColor: '#fff',
    justifyContent: 'center'

  },
  styleIcon: {
    //flex:0.7,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  styleText: {
    // flex:0.3,
    color: "#ffba00", textAlign: 'center',
    marginBottom: 20,
    fontSize: 30
  },

});

export { styles }