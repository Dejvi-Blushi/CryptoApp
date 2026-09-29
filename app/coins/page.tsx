import AllCoins from "@/components/coins/AllCoins";
import {CoinOverviewFallback} from "@/components/Fallbacks";

import {Suspense} from "react";

export default async function Coins({searchParams}: NextPageProps) {
  const {page} = await searchParams;

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All Coins</h4>

        <Suspense fallback={<CoinOverviewFallback />}>
          <AllCoins page={page} />
        </Suspense>
      </div>
    </main>
  );
}
