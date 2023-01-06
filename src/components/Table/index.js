import React, { useEffect } from 'react';
import './index.scss';

function Table(props) {
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

  const table = props.array.map((x, index) => {
    const value = props.map.get(x);
    if (!value || index > 7) {
      return null;
    }
    return (
      <tr className={value.status} key={x}>
        <td className="price">{formatPrice(x)}</td>
        <td className={value.status}>{formaNumber(value.size)}</td>
        <td
          style={{
            background: backgroundStyle(value.size, props.quotes, props.type),
          }}
        >
          {formaNumber(value.total)}
        </td>
      </tr>
    );
  });

  return <tbody>{table}</tbody>;
}

export default Table;
