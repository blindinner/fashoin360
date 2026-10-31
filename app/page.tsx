import SmoothScroll from "@/components/SmoothScroll";
import HeroStrip from "@/components/HeroStrip";
import DesignerShowcaseWebGL from "@/components/DesignerShowcaseWebGL";
import ShopTeaser from "@/components/ShopTeaser";
import LiveSection from "@/components/LiveSection";
import EditorialSection from "@/components/EditorialSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <HeroStrip />
        <DesignerShowcaseWebGL />
        <ShopTeaser />
        <LiveSection />
        <EditorialSection />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
