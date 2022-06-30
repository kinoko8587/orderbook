import { createSlice } from "@reduxjs/toolkit";

export const orderBookSlice = createSlice({
  name: "orderBook",
  initialState: {
    bids: new Map(),
    asks: new Map(),
    bidsArr: [],
    asksArr: [],
    price: 0,
    lastPrice: -1,
    sellQuotes: 0,
    buyQuotes: 0,
  },
  reducers: {
    updateOrderBook: (state, action) => {
      if (!action.payload.data) {
        return;
      }
      if (action.payload.data.type === "snapshot") {
        action.payload.data.bids.forEach((element) => {
          const key = Number(element[0]);
          const size = parseInt(element[1]);
          const obj = {
            size: size,
            total: size,
            status: "",
          };
          state.bids.set(key, obj);
          state.sellQuotes += size;
          if (state.bidsArr.length < 8) {
            state.bidsArr.push(key);
          }
        });
        action.payload.data.asks.forEach((element) => {
          const key = Number(element[0]);
          const size = parseInt(element[1]);
          const obj = {
            size: size,
            total: size,
            status: "",
          };
          state.asks.set(key, obj);
          state.buyQuotes += size;
          if (state.asksArr.length < 8) {
            state.asksArr.push(key);
          }
        });
      } else {
        action.payload.data.bids.forEach((element) => {
          const key = Number(element[0]);
          const size = parseInt(element[1]);
          if (state.bids.has(key)) {
            if (size === 0) {
              state.bids.delete(key);
              state.bidsArr = [...remove(state.bidsArr, key)];
            } else {
              const data = state.bids.get(key);
              data.total = data.size + size;
              data.status = size > data.size ? "increase" : "decrease";
              data.size = size;
              state.bids.set(key, data);
              state.sellQuotes += size;
              state.bidsArr = [...update(state.bidsArr, key)];
            }
          } else {
            if (size === 0) {
              return;
            }
            const obj = {
              size: size,
              total: size,
              status: "new",
            };
            state.bids.set(key, obj);
            state.bidsArr = [...update(state.bidsArr, key)];
          }
        });
        action.payload.data.asks.forEach((element) => {
          const key = Number(element[0]);
          const size = parseInt(element[1]);
          if (state.asks.has(key)) {
            if (size === 0) {
              state.asks.delete(key);
              state.asksArr = [...remove(state.asksArr, key)];
            } else {
              const data = state.asks.get(key);
              data.total = data.size + size;
              data.status = size > data.size ? "increase" : "decrease";
              data.size = size;
              state.asks.set(key, data);
              state.buyQuotes += size;
              state.asksArr = [...update(state.asksArr, key)];
            }
          } else {
            if (size === 0) {
              return;
            }
            const obj = {
              size: size,
              total: size,
              status: "new",
            };
            state.asks.set(key, obj);
            state.asksArr = [...update(state.asksArr, key)];
          }
        });
      }
    },
    updateTradeHistory: (state, action) => {
      if (action.payload.topic !== "tradeHistoryApi") {
        return;
      }
      if (state.price !== 0) {
        state.lastPrice = state.price;
      }
      const data = action.payload.data[0];
      state.price = data.price;
    },
  },
});

const update = (arr, num) => {
  if (arr[arr.length - 1] >= num) {
    return arr;
  }
  if (arr.find((x) => x === num)) {
    return arr;
  }
  if (arr.length < 7) {
    return arr.push(num);
  }
  arr.splice(7, 1, num);
  return arr.sort((a, b) => {
    return b - a;
  });
};

const remove = (arr, num) => {
  const index = arr.findIndex(num);
  return index ? arr : arr.splice(index, 0, num);
};

export const { updateOrderBook, updateTradeHistory } = orderBookSlice.actions;

export default orderBookSlice.reducer;
