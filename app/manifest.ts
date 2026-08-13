import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MeroPrize — Pay Bill • Win Everyday",
    short_name: "MeroPrize",
    description: "Save IRD coupons once and automatically check them against official winner lists.",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#14161C",
    theme_color: "#16181F",
    categories: ["utilities", "finance", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "My Coupons",
        short_name: "Coupons",
        url: "/dashboard/coupons",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "IRD Draws",
        short_name: "Draws",
        url: "/dashboard/draws",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
