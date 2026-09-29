"use client";

import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {fetcher} from "@/lib/coingecko.actions";
import Link from "next/link";
import Image from "next/image";
import {TrendingDown, TrendingUp} from "lucide-react";
import {Separator} from "@/components/ui/separator";

type CoinSearchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CoinSearchModal({
  open,
  onOpenChange
}: CoinSearchModalProps) {
  const [search, setSearch] = useState("");
  const [coins, setCoins] = useState<CoinMarketData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || search.trim()) return;

    console.log(!!!!search.trim());

    const fetchTopCoins = async () => {
      try {
        setLoading(true);

        const data = await fetcher<CoinMarketData[]>("/coins/markets", {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
          sparkline: false,
          price_change_percentage: "24h"
        });

        setCoins(data ?? []);
      } catch (error) {
        console.error("Failed to fetch top coins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCoins();
  }, [open, search]);

  useEffect(() => {
    if (!open || !search.trim()) return;

    const searchCoins = async () => {
      try {
        setLoading(true);

        const searchData = await fetcher<{coins: SearchCoin[]}>("/search", {
          query: search.trim()
        });

        const ids = searchData.coins
          .slice(0, 10)
          .map((coin) => coin.id)
          .join(",");

        if (!ids) {
          setCoins([]);
          return;
        }

        const marketData = await fetcher<CoinMarketData[]>("/coins/markets", {
          vs_currency: "usd",
          ids,
          sparkline: false,
          price_change_percentage: "24h"
        });

        setCoins(marketData ?? []);
      } catch (error) {
        console.error("Failed to search coins:", error);
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };

    searchCoins();
  }, [open, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 p-0 overflow-hidden gap-0">
        <div className="px-6 py-3">
          <Input
            placeholder="Search coin by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus-visible:ring-0 bg-transparent! p-0!"
          />
        </div>

        <Separator className="divider h-px" />

        <div className="custom-scrollbar max-h-100 overflow-y-auto p-2">
          {loading ? (
            <p className="py-3 text-center text-muted-foreground">Loading...</p>
          ) : coins.length === 0 ? (
            <p className="py-3 text-center text-muted-foreground">
              No coins found
            </p>
          ) : (
            <div className="space-y-1">
              {coins.map((coin) => (
                <Link
                  key={coin.id}
                  href={`/coins/${coin.id}`}
                  className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent"
                >
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={36}
                    height={36}
                  />

                  <div className="flex-1">
                    <p className="font-medium">{coin.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {coin.symbol.toUpperCase()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span
                      className={
                        (coin.price_change_percentage_24h ?? 0) >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {(coin.price_change_percentage_24h ?? 0) >= 0 ? (
                        <TrendingUp />
                      ) : (
                        <TrendingDown />
                      )}
                    </span>
                    <span
                      className={
                        (coin.price_change_percentage_24h ?? 0) >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {coin.price_change_percentage_24h?.toFixed(2) ?? "0.00"}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
