"use client";

import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG
} from "@/constants";

import {fetcher} from "@/lib/coingecko.actions";
import {convertOHLCData} from "@/lib/utils";
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi
} from "lightweight-charts";
import {useEffect, useRef, useState} from "react";

export default function CandlestickChart({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = "daily",
  liveOhlcv,
  mode = "historical"
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const prevOhlcDataLength = useRef<number>(data?.length || 0);

  const [period, setPeriod] = useState(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);

  const fetchOHCLData = async (selectedPeriod: Period) => {
    try {
      const {days} = PERIOD_CONFIG[selectedPeriod];

      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: "usd",
        days,
        precision: "full"
      });

      setOhlcData(newData ?? []);
    } catch (error) {
      console.error("Failed to fetch OHLCData", error);
    }
  };

  const handlePeriodChange = async (newPeriod: Period) => {
    if (newPeriod === period) return;

    setPeriod(newPeriod);
    await fetchOHCLData(newPeriod);
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const showTime = ["daily", "weekly", "monthly"].includes(period);

    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth
    });

    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000),
          item[1],
          item[2],
          item[3],
          item[4]
        ] as OHLCData
    );

    series.setData(convertOHLCData(convertedToSeconds));
    chart.timeScale().fitContent();

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({width: entries[0].contentRect.width});
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [height, period]);

  useEffect(() => {
    if (!candleSeriesRef.current) return;

    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000),
          item[1],
          item[2],
          item[3],
          item[4]
        ] as OHLCData
    );

    let merged: OHLCData[];

    if (liveOhlcv) {
      const liveCandle: OHLCData = [
        Math.floor(liveOhlcv[0] / 1000),
        liveOhlcv[1],
        liveOhlcv[2],
        liveOhlcv[3],
        liveOhlcv[4]
      ];

      const liveTimestamp = liveCandle[0];

      const lastHistoricalCandle =
        convertedToSeconds[convertedToSeconds.length - 1];

      if (lastHistoricalCandle && lastHistoricalCandle[0] === liveTimestamp) {
        merged = [...convertedToSeconds.slice(0, -1), liveCandle];
      } else {
        merged = [...convertedToSeconds, liveCandle];
      }
    } else {
      merged = convertedToSeconds;
    }

    merged.sort((a, b) => a[0] - b[0]);
    const converted = convertOHLCData(merged);

    candleSeriesRef.current.setData(converted);

    const dataChange = prevOhlcDataLength.current !== ohlcData.length;

    if (dataChange || mode === "historical") {
      chartRef.current?.timeScale().fitContent();
      prevOhlcDataLength.current = ohlcData.length;
    }
  }, [ohlcData, period, liveOhlcv, mode]);

  return (
    <div id="candlestick-chart">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="button-group">
          <span className="text-sm mx-2 font-medium text-purple-100/50">
            Period:
          </span>
          {PERIOD_BUTTONS.map(({value, label}) => (
            <button
              key={value}
              className={
                period === value ? "config-button-active" : "config-button"
              }
              onClick={() => handlePeriodChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="chart" style={{height}} />
    </div>
  );
}
