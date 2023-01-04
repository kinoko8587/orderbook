import React, { useState, useEffect } from 'react';
import './App.scss';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderBook, updateTradeHistory, reset } from './store/orderBook';
import Orderbook from './components/Orderbook';

const endpoint =
  'wss://ws.btse.com/ws/oss/futures?api_key=4e9536c79f0fdd72bf04f2430982d3f61d9d76c996f0175bbba470d69d59816x';
const endPointTradeHistory =
  'wss://ws.btse.com/ws/futures?api_key=4e9536c79f0fdd72bf04f2430982d3f61d9d76c996f0175bbba470d69d59816x';

function App() {
  const dispatch = useDispatch();

  const [ws] = useState(() => new WebSocket(endpoint));
  const [wsTradeHistory] = useState(() => new WebSocket(endPointTradeHistory));
  const prevSeqNum = useSelector((state) => state.orderBook.prevSeqNum);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log('ws open connection');
        ws.send(JSON.stringify(subscribeUpdate()));
      };

      ws.onclose = () => {
        console.log('ws close connection');
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.op === 'unsubscribe') {
          console.log(response);
          ws.send(JSON.stringify(subscribeUpdate()));
          return;
        }
        if (prevSeqNum === 0 || prevSeqNum === response.data.prevSeqNum) {
          dispatch(updateOrderBook(response));
        } else {
          console.log('unsubscribeUpdate');
          ws.send(JSON.stringify(unsubscribeUpdate()));
          dispatch(reset());
        }
      };
    }
    if (wsTradeHistory) {
      wsTradeHistory.onopen = () => {
        console.log('TradeHistory open connection');
        wsTradeHistory.send(JSON.stringify(subscribeTradeHistory()));
      };

      wsTradeHistory.onclose = () => {
        console.log('TradeHistory close connection');
      };

      wsTradeHistory.onmessage = (event) => {
        const response = JSON.parse(event.data);
        dispatch(updateTradeHistory(response));
      };
    }
  }, [ws, wsTradeHistory]);

  const subscribeUpdate = () => {
    return {
      op: 'subscribe',
      args: ['update:BTCPFC'],
    };
  };

  const unsubscribeUpdate = () => {
    return {
      op: 'unsubscribe',
      args: ['update:BTCPFC'],
    };
  };

  const subscribeTradeHistory = () => {
    return {
      op: 'subscribe',
      args: ['tradeHistoryApi:BTCPFC'],
    };
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
