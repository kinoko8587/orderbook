import { createSlice } from '@reduxjs/toolkit';

export const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState: {
    bids: new Map(),
    asks: new Map(),
    bidsArr: [],
    asksArr: [],
    price: 0,
    lastPrice: -1,
    sellQuotes: 0,
    buyQuotes: 0,
    prevSeqNum: 0,
  },
  reducers: {
    updateOrderBook: (state, action) => {
      if (!action.payload.data) {
        return;
      }
      state.prevSeqNum = action.payload.data.seqNum;
      if (action.payload.data.type === 'snapshot') {
        action.payload.data.bids.forEach((element) => {
          const key = Number(element[0]);
          const obj = addNewObj(element);
          state.bids.set(key, obj);
          state.buyQuotes += obj.size;
          state.bidsArr.push(key);
        });
        action.payload.data.asks.forEach((element) => {
          const key = Number(element[0]);
          const obj = addNewObj(element);
          state.asks.set(key, obj);
          state.sellQuotes += obj.size;
          state.asksArr.push(key);
        });
        return;
      }
      action.payload.data.bids.forEach((element) => {
        updateData(element, state.bids, state.bidsArr, state.buyQuotes);
      });
      action.payload.data.asks.forEach((element) => {
        updateData(element, state.asks, state.asksArr, state.sellQuotes);
      });
    },
    updateTradeHistory: (state, action) => {
      if (action.payload.topic !== 'tradeHistoryApi') {
        return;
      }
      if (state.price !== 0) {
        state.lastPrice = state.price;
      }
      const data = action.payload.data[0];
      state.price = data.price;
    },
    reset: (state) => {
      state.bids = new Map();
      state.asks = new Map();
      state.bidsArr = [];
      state.asksArr = [];
      state.sellQuotes = 0;
      state.buyQuotes = 0;
      state.prevSeqNum = 0;
    },
  },
});

const updateArr = (arr, num) => {
  if (arr.length === 0) {
    arr.push(num);
  }
  const max = arr[0];
  const min = arr[arr.length - 1];
  if (num > max) {
    arr.unshift(num);
    return arr;
  }
  if (num < min) {
    arr.push(num);
    return arr;
  }
  for (let i = 0; i < arr.length; i++) {
    if (num === arr[i]) {
      return arr;
    }
    if (num > arr[i]) {
      arr.splice(i, 0, num);
      return arr;
    }
  }
};

const remove = (arr, num) => {
  return arr.filter((x) => x !== num);
};

const addNewObj = (element) => {
  const size = parseInt(element[1]);
  const obj = {
    size: size,
    total: size,
    status: '',
  };
  return obj;
};

const updateData = (element, map, array, quotes) => {
  const key = Number(element[0]);
  const size = parseInt(element[1]);
  if (map.has(key)) {
    if (size === 0) {
      map.delete(key);
      array = [...remove(array, key)];
    } else {
      const data = map.get(key);
      data.total = data.size + size;
      data.status = size > data.size ? 'increase' : 'decrease';
      quotes -= data.size;
      data.size = size;
      quotes += size;
      map.set(key, data);
      array = [...updateArr(array, key)];
    }
  } else {
    if (size === 0) {
      return;
    }
    const obj = {
      size: size,
      total: size,
      status: 'new',
    };
    map.set(key, obj);
    quotes += size;
    array = [...updateArr(array, key)];
  }
};

export const { updateOrderBook, updateTradeHistory, reset } =
  orderBookSlice.actions;

export default orderBookSlice.reducer;
