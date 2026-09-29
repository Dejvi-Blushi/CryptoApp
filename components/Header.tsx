"use client";

import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {cn} from "cn";
import CoinSearchModal from "@/components/CoinSearchModal";
import {useEffect, useState} from "react";
import {Search} from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsCoinModalOpen(false);
  }, [pathname]);

  return (
    <header>
      <div className="main-container inner">
        <Link href="/">
          <Image
            className="inline"
            src="/logo.svg"
            alt="Crypto App logo"
            width={33}
            height={10}
          />{" "}
          CryptoApp
        </Link>

        <nav>
          <Link
            href="/"
            className={cn("nav-link", {
              "is-active": pathname === "/",
              "is-home": true
            })}
          >
            Home
          </Link>

          <button
            onClick={() => setIsCoinModalOpen(true)}
            className="nav-link space-x-2"
          >
            <Search size={18} />
            <span> Search</span>
          </button>

          <Link
            href="/coins"
            className={cn("nav-link", {
              "is-active": pathname === "/coins"
            })}
          >
            All Coins
          </Link>
        </nav>

        <CoinSearchModal
          open={isCoinModalOpen}
          onOpenChange={setIsCoinModalOpen}
        />
      </div>
    </header>
  );
}
