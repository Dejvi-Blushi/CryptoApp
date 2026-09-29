type OHLCData = [number, number, number, number, number];

type NextPageProps = {
  params: Promise<{[key: string]: string}>;
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
};

type CandlestickChartProps = {
  data?: OHLCData[];
  liveOhlcv?: OHLCData | null;
  coinId: string;
  height?: number;
  children?: React.ReactNode;
  mode?: "historical" | "live";
  initialPeriod?: Period;
};

type ConverterProps = {
  symbol: string;
  icon: string;
  priceList: Record<string, number>;
};

type Ticker = {
  market: {
    name: string;
  };
  base: string;
  target: string;
  converted_last: {
    usd: number;
  };
  timestamp: string;
  trade_url: string;
};

type Period = "daily" | "weekly" | "monthly" | "3months" | "6months" | "yearly";

type CoinMarketData = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
};

type TrendingCoin = {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
    data: {
      price: number;
      price_change_percentage_24h: {
        usd: number;
      };
    };
  };
};

type SearchCoin = {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
  data: {
    price?: number;
    price_change_percentage_24h: number;
  };
};

type ChartSectionProps = {
  coinData: {
    image: {large: string};
    name: string;
    symbol: string;
    market_data: {
      current_price: {usd: number};
    };
  };
  coinOHLCData: OHLCData[];
  coinId: string;
};

type PriceData = {
  usd: number;
};

type Trade = {
  price?: number;
  timestamp?: number;
  type?: string;
  amount?: number;
  value?: number;
};

type ExtendedPriceData = {
  usd: number;
  coin?: string;
  price?: number;
  change24h?: number;
  marketCap?: number;
  volume24h?: number;
  timestamp?: number;
};

type WebSocketMessage = {
  type?: string;
  c?: string;
  ch?: string;
  i?: string;
  p?: number;
  pp?: number;
  pu?: number;
  m?: number;
  v?: number;
  vo?: number;
  o?: number;
  h?: number;
  l?: number;
  t?: number;
  to?: number;
  ty?: string;
  channel?: string;
  identifier?: string;
};

type CoinDetailsData = {
  id: string;
  name: string;
  symbol: string;
  asset_platform_id?: string | null;
  detail_platforms?: Record<
    string,
    {
      geckoterminal_url: string;
      contract_address: string;
    }
  >;
  image: {
    large: string;
    small: string;
  };
  market_data: {
    current_price: {
      usd: number;
      [key: string]: number;
    };
    price_change_24h_in_currency: {
      usd: number;
    };
    price_change_percentage_24h_in_currency: {
      usd: number;
    };
    price_change_percentage_30d_in_currency: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
  };
  market_cap_rank: number;
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    subreddit_url: string;
  };
  tickers: Ticker[];
};

type LiveDataProps = {
  coinId: string;
  coin: CoinDetailsData;
  coinOHLCData?: OHLCData[];
};

type LiveCoinHeaderProps = {
  name: string;
  image: string;
  livePrice?: number;
  livePriceChangePercentage24h: number;
  priceChangePercentage30d: number;
  priceChange24h: number;
};

type Category = {
  name: string;
  top_3_coins: string[];
  market_cap_change_24h: number;
  market_cap: number;
  volume_24h: number;
};

type UseWebSocketProps = {
  coinSymbol: string;
};

type UseWebSocketReturn = {
  price: ExtendedPriceData | null;
  trades: Trade[];
  ohlcv: OHLCData | null;
  isConnected: boolean;
};

type DataTableColumn<T> = {
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  headClassName?: string;
  cellClassName?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => React.Key;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyRowClassName?: string;
  bodyCellClassName?: string;
};

type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";

type PaginationLinkProps = {
  isActive?: boolean;
  size?: ButtonSize;
} & React.ComponentProps<"a">;

type Pagination = {
  currentPage: number;
  totalPages: number;
  hasMorePages: boolean;
};

type HeaderProps = {
  trendingCoins: TrendingCoin[];
};

type SearchItemCoin = SearchCoin | TrendingCoin["item"];

type SearchItemProps = {
  coin: SearchItemCoin;
  onSelect: (coinId: string) => void;
  isActiveName: boolean;
};

type CoinGeckoErrorBody = {
  error?: string;
};

type QueryParams = Record<string, string | number | boolean | undefined>;

type PoolData = {
  id: string;
  address: string;
  name: string;
  network: string;
};
