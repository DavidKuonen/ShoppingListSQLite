import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('shoppingListDB.db');

export default function App() {

 

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
    tx.executeSql('create table if not exists shoppingitem (id integer primary key not null, product text, amount text);');
    }, null, updateList);
    }, []);

  /*Opening a database returns database object. The object has method transaction
which can be used for database operations. Method has three parameters: The first
is one is used to execute sql statement. The second one is executed if errors
happen. The third one is executed when transaction is completed successfully. 

db.transaction(callback, error, success)
*/

const updateList = () => {
  db.transaction(tx => {
  tx.executeSql('select * from shoppingitem;', [], (_, { rows }) =>
  setShoppingList(rows._array)
  );
  }, null, null);
  }



  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into shoppingitem (product, amount) values (?, ?);', [product, amount]);    
      }, null, updateList
    )
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shoppingitem where id = ?;`, [id]);
      }, null, updateList
    )    
  }


  return (
    <View style={styles.container}>

   <View style={styles.textFields}>
    <TextInput  style={{width: 200, borderColor: 'gray', borderWidth: 1}}
      placeholder='Product'
      onChangeText={product => setProduct(product)}
      value={product} />
   
   <TextInput  style={{width: 200, borderColor: 'gray', borderWidth: 1}}
      placeholder='Amount'
      keyboardType='numeric'
      onChangeText={amount => setAmount(amount)}
      value={amount} />
   </View>

   <View  style={styles.buttons}>
    <Button title='Save' onPress={saveItem}></Button>
   </View>

   <View style={styles.ShoppingFields}>
    <Text style={styles.ShoppingListTitle}>Shopping List</Text>
    <FlatList 
    data={shoppingList}
    keyExtractor={item => item.id.toString()}
    renderItem={({item})=> (
      <View> 
      <Text>{item.product},{item.amount} </Text>
      <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>bought</Text>
      </View>
    )}
    />
   </View>

   </View>
  );
}

//Instead of a CSS File use StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#fff'
  },

  textFields: {
    flex: 3,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingTop: 180
  },

  buttons: {
    flex: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 165,
    paddingTop: 10
  },

  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  ShoppingFields: {
    flex: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center'
  },

  ShoppingListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "blue"
  }

});
