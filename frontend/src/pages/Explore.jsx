import Navbar from "../components/layout/Navbar";

import ExploreHeader from "../components/crypto/ExploreHeader";
import MarketStats from "../components/crypto/MarketStats";
import CryptoTable from "../components/crypto/CryptoTable";
import Sidebar from "../components/crypto/Sidebar";
import CtaBanner from "../components/crypto/CtaBanner";

export default function Cryptocurrencies() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="max-w-[1180px] mx-auto px-6 pt-10 pb-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <ExploreHeader />
            <MarketStats />
            <CryptoTable />
            <CtaBanner />
          </div>

          {/* Right sidebar */}
          <div className="w-full lg:w-[320px] shrink-0">
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
