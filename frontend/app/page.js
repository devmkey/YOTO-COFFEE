import Link from "next/link";
import HeroAnimated from "../components/HeroAnimated";
import AnimatedCards from "../components/AnimatedCards";
import AnimatedProducts from "../components/AnimatedProducts";

export default function Home() {
  return (
    <>
      <HeroAnimated />
      <AnimatedCards />
      <AnimatedProducts />
    </>
  );
}
