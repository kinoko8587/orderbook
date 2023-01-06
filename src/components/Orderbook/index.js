import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as Icon } from './../../arrow.svg';
import Table from '../Table';
import './index.scss';

function Orderbook() {
  const bids = useSelector((state) => state.orderBook.bids);
  const asks = useSelector((state) => state.orderBook.asks);
  const bidsArr = useSelector((state) => state.orderBook.bidsArr);
  const asksArr = useSelector((state) => state.orderBook.asksArr);
  const price = useSelector((state) => state.orderBook.price);
  const lastPrice = useSelector((state) => state.orderBook.lastPrice);
  const sellQuotes = useSelector((state) => state.orderBook.sellQuotes);
  const buyQuotes = useSelector((state) => state.orderBook.buyQuotes);

  useEffect(() => {});

  const formatPrice = (price) => {
    return price.toLocaleString('en', {
      useGrouping: true,
      minimumFractionDigits: 1,
    });
  };

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
        <Table
          type={'bid'}
          array={bidsArr}
          quotes={buyQuotes}
          map={bids}
        ></Table>
      </table>
      <div className="last-price">{priceComponent()}</div>
      <table className="ask-order" cellSpacing="0" cellPadding="0">
        <Table
          type={'ask'}
          array={asksArr}
          quotes={sellQuotes}
          map={asks}
        ></Table>
      </table>
    </div>
  );
}

export default Orderbook;
