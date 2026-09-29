import {
  CategoriesFallback,
  CoinOverviewFallback,
  TrendingCoinsFallback
} from "@/components/Fallbacks";

import CoinOverview from "@/components/home/CoinOverview";
import TopCategories from "@/components/home/TopCategories";
import TrendingCoins from "@/components/home/TrendingCoins";
import {Suspense} from "react";

export default function Home() {
  return (
    <main className="main-container">
      <section className="home-grid">
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview />
        </Suspense>
        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins />
        </Suspense>
      </section>

      <section className="w-full mt-7 space-y-4">
        <Suspense fallback={<CategoriesFallback />}>
          <TopCategories />
        </Suspense>
      </section>
    </main>
  );
}
