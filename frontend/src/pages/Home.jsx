import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsPreview from "../components/StatsPreview";
import Features from "../components/Features";
import Footer from "../components/Footer";
import ParkingMap from "../components/ParkingMap";
import VehicleEntry from "../components/VehicleEntry";
import VehicleExit from "../components/VehicleExit";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Hero />
        <StatsPreview />
        <ParkingMap />
        <VehicleEntry />
        <VehicleExit />
        <Features />
      </main>
      <Footer />
    </div>
  );
}