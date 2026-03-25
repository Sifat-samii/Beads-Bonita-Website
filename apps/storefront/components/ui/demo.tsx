import InteractiveSelector, {
  type InteractiveSelectorOption,
} from "@/components/ui/interactive-selector";

const demoOptions: InteractiveSelectorOption[] = [
  {
    id: "necklaces",
    title: "Necklaces",
    description: "Layered statement pieces and softer everyday chains.",
    href: "/shop",
    imageUrl:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "bracelets",
    title: "Bracelets",
    description: "Hand-finished stacks with texture, color, and movement.",
    href: "/shop",
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "earrings",
    title: "Earrings",
    description: "Lightweight silhouettes designed to frame the face.",
    href: "/shop",
    imageUrl:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=900&q=80",
  },
];

const DemoOne = () => {
  return <InteractiveSelector options={demoOptions} />;
};

export { DemoOne };
