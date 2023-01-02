import React, { useState, useEffect } from 'react';
import './App.scss';
import { useDispatch } from 'react-redux';
import { updateOrderBook, updateTradeHistory } from './store/orderBook';
import Orderbook from './components/Orderbook';

const endpoint =
  'wss://ws.btse.com/ws/oss/futures?api_key=4e9536c79f0fdd72bf04f2430982d3f61d9d76c996f0175bbba470d69d59816x';
const endPointTradeHistory =
  'wss://ws.btse.com/ws/futures?api_key=4e9536c79f0fdd72bf04f2430982d3f61d9d76c996f0175bbba470d69d59816x';

function App() {
  const dispatch = useDispatch();

  const [ws] = useState(() => new WebSocket(endpoint));
  const [wsTradeHistory] = useState(() => new WebSocket(endPointTradeHistory));

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log('ws open connection');
        sendMessage();
      };

      ws.onclose = () => {
        console.log('close connection');
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        dispatch(updateOrderBook(response));
      };
    }
    if (wsTradeHistory) {
      wsTradeHistory.onopen = () => {
        console.log('wsTradeHistory open connection');
        sendMessageTradeHistory();
      };

      wsTradeHistory.onclose = () => {
        console.log('close connection');
      };

      wsTradeHistory.onmessage = (event) => {
        const response = JSON.parse(event.data);
        dispatch(updateTradeHistory(response));
      };
    }
  }, [ws, wsTradeHistory]);

  const sendMessage = () => {
    const api = {
      op: 'subscribe',
      args: ['update:BTCPFC'],
    };
    ws.send(JSON.stringify(api));
  };

  const sendMessageTradeHistory = () => {
    const api2 = {
      op: 'subscribe',
      args: ['tradeHistoryApi:BTCPFC'],
    };
    wsTradeHistory.send(JSON.stringify(api2));
  };

  return (
    <div className="app">
      <h2>Order Book</h2>
      <div className="line"></div>
      <Orderbook></Orderbook>
    </div>
  );
}

export default App;
