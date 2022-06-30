import React, { useState, useEffect } from "react";
import "./App.scss";
import { useSelector, useDispatch } from "react-redux";
import { updateOrderBook, updateTradeHistory } from "./store/orderBook";
import { ReactComponent as Icon } from "./arrow.svg";

const endpoint =
  "wss://ws.btse.com/ws/oss/futures?api_key=4e9536c79f0fdd72bf04f2430982d3f61d9d76c996f0175bbba470d69d59816x";
const endPointTradeHistory =
  "wss://ws.btse.com/ws/futures?api_key=4e9536c79f0fdd72bf04f2430982d3f61d9d76c996f0175bbba470d69d59816x";

function App() {
  const dispatch = useDispatch();
  const bids = useSelector((state) => state.orderBook.bids);
  const asks = useSelector((state) => state.orderBook.asks);
  const bidsArr = useSelector((state) => state.orderBook.bidsArr);
  const asksArr = useSelector((state) => state.orderBook.asksArr);
  const price = useSelector((state) => state.orderBook.price);
  const lastPrice = useSelector((state) => state.orderBook.lastPrice);
  const sellQuotes = useSelector((state) => state.orderBook.sellQuotes);
  const buyQuotes = useSelector((state) => state.orderBook.buyQuotes);

  const [ws] = useState(() => new WebSocket(endpoint));
  const [wsTradeHistory] = useState(() => new WebSocket(endPointTradeHistory));

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log("ws open connection");
        sendMessage();
      };

      ws.onclose = () => {
        console.log("close connection");
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        dispatch(updateOrderBook(response));
      };
    }
    if (wsTradeHistory) {
      wsTradeHistory.onopen = () => {
        console.log("wsTradeHistory open connection");
        sendMessageTradeHistory();
      };

      wsTradeHistory.onclose = () => {
        console.log("close connection");
      };

      wsTradeHistory.onmessage = (event) => {
        const response = JSON.parse(event.data);
        dispatch(updateTradeHistory(response));
      };
    }
  }, [ws, wsTradeHistory]);

  const sendMessage = () => {
    const api = {
      op: "subscribe",
      args: ["update:BTCPFC"],
    };
    ws.send(JSON.stringify(api));
  };

  const sendMessageTradeHistory = () => {
    const api2 = {
      op: "subscribe",
      args: ["tradeHistoryApi:BTCPFC"],
    };
    wsTradeHistory.send(JSON.stringify(api2));
  };

  const backgroundStyle = (size, quotes, type) => {
    const color =
      type === "bid" ? "rgba(255, 90, 90, 0.12)" : "rgba(16, 186, 104, 0.12)";
    const percent = (size / quotes).toFixed(1);
    return `linear-gradient(90deg,rgba(255, 90, 90, 0) ${
      100 - percent
    }%, ${color} ${percent}%)`;
  };

  const bidsTable = bidsArr.map((x) => {
    const value = bids.get(x);
    return (
      <tr className={value.status}>
        <td className="price">{x}</td>
        <td className={value.status}>{value.size}</td>
        <td
          style={{
            background: backgroundStyle(value.size, buyQuotes, "bid"),
          }}
        >
          {value.total}
        </td>
      </tr>
    );
  });

  const asksTable = asksArr.map((x) => {
    const value = asks.get(x);
    return (
      <tr className={value.status}>
        <td className="price">{x}</td>
        <td className={value.status}>{value.size}</td>
        <td
          style={{
            background: backgroundStyle(value.size, sellQuotes, "ask"),
          }}
        >
          {value.total}
        </td>
      </tr>
    );
  });

  const priceComponent = () => {
    if (price) {
      return (
        <div className={compare()}>
          {price} <Icon className="icon" alt="logo" />
        </div>
      );
    } else {
      return <div></div>;
    }
  };
  const compare = () => {
    if (price > lastPrice) {
      return "big";
    } else if (price < lastPrice) {
      return "small";
    }
    return "";
  };

  return (
    <div className="App">
      <h2>Order Book</h2>
      <table className="bid-order" cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            <th scope="col">Price(USD)</th>
            <th scope="col">Size</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>{bidsTable}</tbody>
      </table>
      <div className="last-price">{priceComponent()}</div>
      <table className="ask-order" cellSpacing="0" cellPadding="0">
        <tbody>{asksTable}</tbody>
      </table>
    </div>
  );
}

export default App;
