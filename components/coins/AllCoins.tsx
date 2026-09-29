import {fetcher} from "@/lib/coingecko.actions";

import {cn} from "cn";

import Link from "next/link";
import Image from "next/image";

import DataTable from "@/components/DataTable";
import {formatCurrency, formatPercentage} from "@/lib/utils";
import {TrendingCoinsFallback} from "@/components/Fallbacks";

import PaginationC from "./Pagination";

type pageQuery = {page: string | string[] | undefined};

const columns: DataTableColumn<CoinMarketData>[] = [
  {
    header: "Rank",
    cellClassName: "rank-cell",
    cell: (coin) => (
      <>
        #{coin.market_cap_rank}
        <Link href={`/coins/${coin.id}`} aria-label="View coin" />
      </>
    )
  },
  {
    header: "Token",
    cellClassName: "token-cell",
    cell: (coin) => (
      <div className="token-info">
        <Image src={coin.image} alt={coin.name} width={36} height={36} />
        <p>
          {coin.name} ({coin.symbol.toUpperCase()})
        </p>
      </div>
    )
  },
  {
    header: "Price",
    cellClassName: "price-cell",
    cell: (coin) => formatCurrency(coin.current_price)
  },
  {
    header: "24h Change",
    cellClassName: "change-cell",
    cell: (coin) => {
      const isTrendingUp = coin.price_change_percentage_24h > 0;

      return (
        <span
          className={cn("change-value", {
            "text-green-600": isTrendingUp,
            "text-red-500": !isTrendingUp
          })}
        >
          {isTrendingUp && "+"}
          {formatPercentage(coin.price_change_percentage_24h)}
        </span>
      );
    }
  },
  {
    header: "Market Cap",
    cellClassName: "market-cap-cell",
    cell: (coin) => formatCurrency(coin.market_cap)
  }
];

export default async function AllCoins({page}: pageQuery) {
  const currentPage = Number(page) || 1;
  const perPage = 10;

  let allCoins;

  try {
    allCoins = await fetcher<CoinMarketData[]>("/coins/markets", {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: perPage,
      page: currentPage,
      sparkline: false,
      price_change_percentage: "24"
    });
  } catch (error) {
    console.error("Error fetching trending coins:", error);
    return <TrendingCoinsFallback />;
  }
  const hasMorePages = allCoins.length === perPage;

  const estimatedTotalPages =
    currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;

  return (
    <>
      {allCoins.length === 0 ? (
        <p>No coins found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          <DataTable
            tableClassName="coins-table"
            data={allCoins}
            columns={columns}
            rowKey={(coin) => coin.id}
          />

          <PaginationC
            currentPage={currentPage}
            totalPages={estimatedTotalPages}
            hasMorePages={hasMorePages}
          />
        </div>
      )}
    </>
  );
}
