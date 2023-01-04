import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as Icon } from './../../arrow.svg';

function Orderbook() {
  const dispatch = useDispatch();
  const bids = useSelector((state) => state.orderBook.bids);
  const asks = useSelector((state) => state.orderBook.asks);
  const bidsArr = useSelector((state) => state.orderBook.bidsArr);
  const asksArr = useSelector((state) => state.orderBook.asksArr);
  const price = useSelector((state) => state.orderBook.price);
  const lastPrice = useSelector((state) => state.orderBook.lastPrice);
  const sellQuotes = useSelector((state) => state.orderBook.sellQuotes);
  const buyQuotes = useSelector((state) => state.orderBook.buyQuotes);

  useEffect(() => {});

  const backgroundStyle = (size, quotes, type) => {
    const color =
      type === 'bid' ? 'rgba(255, 90, 90, 0.12)' : 'rgba(16, 186, 104, 0.12)';
    const percent = (size / quotes).toFixed(1);
    return `linear-gradient(90deg,rgba(255, 90, 90, 0) ${
      100 - percent
    }%, ${color} ${percent}%)`;
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en', {
      useGrouping: true,
      minimumFractionDigits: 1,
    });
  };

  const formaNumber = (num) => {
    return num.toLocaleString('en');
  };

  const bidsTable = bidsArr.map((x, index) => {
    const value = bids.get(x);
    if (!value || index > 7) {
      return null;
    }
    return (
      <tr className={value.status} key={x}>
        <td className="price">{formatPrice(x)}</td>
        <td className={value.status}>{formaNumber(value.size)}</td>
        <td
          style={{
            background: backgroundStyle(value.size, buyQuotes, 'bid'),
          }}
        >
          {formaNumber(value.total)}
        </td>
      </tr>
    );
  });

  const asksTable = asksArr.map((x, index) => {
    const value = asks.get(x);
    if (!value || index > 7) {
      return null;
    }
    return (
      <tr className={value.status} key={x}>
        <td className="price">{formatPrice(x)}</td>
        <td className={value.status}>{formaNumber(value.size)}</td>
        <td
          style={{
            background: backgroundStyle(value.size, sellQuotes, 'ask'),
          }}
        >
          {formaNumber(value.total)}
        </td>
      </tr>
    );
  });

  const priceComponent = () => {
    if (price) {
      return (
        <div className={compare()}>
          {formatPrice(price)} <Icon className="icon" alt="logo" />
        </div>
      );
    } else {
      return <div></div>;
    }
  };
  const compare = () => {
    if (price > lastPrice) {
      return 'big';
    } else if (price < lastPrice) {
      return 'small';
    }
    return '';
  };

  return (
    <div className="orderbook">
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

export default Orderbook;
