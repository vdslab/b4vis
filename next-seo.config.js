export default {
  defaultTitle: "b4vis",
  description:
    "吹奏楽コンクールと夏の甲子園で上位大会に進んだ高校を見ることができます",
  canonical: "https://vdslab-b4vis.vercel.app",
  additionalMetaTags: [
    {
      property: "dc:creator",
      content: "運営者名",
    },
    {
      name: "application-name",
      content: "サイト名",
    },
  ],
  openGraph: {
    url: "https://vdslab-b4vis.vercel.app",
    type: "website",
    locale: "ja_JP",
    site_name: "b4vis",
    images: [
      {
        url: "https://vdslab-b4vis.vercel.app/images/ogp.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};
