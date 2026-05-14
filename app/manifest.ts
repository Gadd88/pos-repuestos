export default function manifest() {
  return {
    name: "Control de Stock",
    short_name: "Stock",
    start_url: "/admin",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}