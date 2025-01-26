```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, LogBox } from 'react-native';

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        //Added Check for data integrity
        if (!Array.isArray(jsonData) || jsonData.length ===0){
          throw new Error('Invalid data received from API');
        }
        setData(jsonData);
        console.log('Data received successfully:', jsonData);
      } catch (err) {
        setError(err);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']); //Ignore nested list warning if any
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      ListEmptyComponent={<Text>No data to show</Text>}
    />
  );
};

export default MyComponent;
```