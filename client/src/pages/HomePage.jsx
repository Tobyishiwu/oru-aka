import Hero from "../components/home/Hero";
import TrustIndicators from "../components/home/TrustIndicators";
import CategoryNav from "../components/home/CategoryNav";
import FeaturedWorkers from "../components/home/FeaturedWorkers";
import JoinCTA from "../components/home/JoinCTA";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <TrustIndicators />
      <CategoryNav />
      <FeaturedWorkers />
      <JoinCTA />
    </div>
  );
}
