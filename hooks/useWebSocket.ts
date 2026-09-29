"use client";

import {useEffect, useRef, useState} from "react";

export const useWebSocket = ({
  coinSymbol
}: UseWebSocketProps): UseWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
  const [isWsReady, setIsWsReady] = useState(false);

  useEffect(() => {
    if (!coinSymbol) return;

    const symbol = `${coinSymbol}USDT`.toLowerCase();

    const streams = [`${symbol}@trade`, `${symbol}@kline_1s`].join("/");

    const ws = new WebSocket(
      `wss://stream.binance.com/stream?streams=${streams}`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      setIsWsReady(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const data = message.data;

      if (!data) return;

      if (data.e === "trade") {
        const trade: Trade = {
          price: Number(data.p),
          value: Number(data.p) * Number(data.q),
          timestamp: data.T,
          type: data.m ? "sell" : "buy",
          amount: Number(data.q)
        };

        setTrades((prev) => [trade, ...prev].slice(0, 8));

        setPrice((prev) => ({
          usd: Number(data.p),
          coin: coinSymbol.toUpperCase(),
          price: Number(data.p),
          change24h: prev?.change24h ?? 0,
          marketCap: prev?.marketCap ?? 0,
          volume24h: prev?.volume24h ?? 0,
          timestamp: data.T
        }));
      }

      if (data.e === "kline") {
        const candle = data.k;

        const ohlc: OHLCData = [
          candle.t,
          Number(candle.o),
          Number(candle.h),
          Number(candle.l),
          Number(candle.c)
        ];

        setOhlcv(ohlc);
      }
    };

    ws.onclose = () => {
      setIsWsReady(false);
    };

    ws.onerror = () => {
      setIsWsReady(false);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [coinSymbol]);

  return {
    price,
    trades,
    ohlcv,
    isConnected: isWsReady
  };
};
