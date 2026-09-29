import {fetcher} from "@/lib/coingecko.actions";

import {cn} from "cn";
import {TrendingDown, TrendingUp} from "lucide-react";
import Image from "next/image";

import DataTable from "../DataTable";

import {CategoriesFallback} from "../Fallbacks";
import {formatCurrency, formatPercentage} from "@/lib/utils";

const columns: DataTableColumn<Category>[] = [
  {
    header: "Category",
    cellClassName: "category-cell",
    cell: (category) => {
      return <p>{category.name}</p>;
    }
  },
  {
    header: "Top Gainers",
    cellClassName: "top-gainers-cell",
    cell: (category) =>
      category.top_3_coins.map((coin) => (
        <Image src={coin} alt={coin} key={coin} width={28} height={28} />
      ))
  },
  {
    header: "24h Change",
    cellClassName: "change-header-cell",
    cell: (category) => {
      const isTrendingUp = category.market_cap_change_24h > 0;

      return (
        <div
          className={cn(
            "change-cell",
            isTrendingUp ? "text-green-500" : "text-red-500"
          )}
        >
          <p className="flex items-center">
            {formatPercentage(category.market_cap_change_24h)}
            {isTrendingUp ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
          </p>
        </div>
      );
    }
  },
  {
    header: "Market Cap",
    cellClassName: "market-cap-cell",
    cell: (category) => formatCurrency(category.market_cap)
  },
  {
    header: "24h Volume",
    cellClassName: "volume-cell",
    cell: (category) => formatCurrency(category.volume_24h)
  }
];

export default async function TopCategories() {
  let topCategories;

  try {
    topCategories = await fetcher<Category[]>("/coins/categories");
  } catch (error) {
    console.error("Error fetching top categories:", error);
    return <CategoriesFallback />;
  }

  return (
    <div id="categories" className="custom-scrollbar">
      <h4>Top Categories</h4>

      <DataTable
        data={topCategories.slice(0, 10)}
        columns={columns}
        rowKey={(_, index) => index}
        tableClassName="mt-3"
      />
    </div>
  );
}
