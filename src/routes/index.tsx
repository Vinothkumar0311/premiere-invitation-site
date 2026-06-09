import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { siteContentQuery, timelineQuery, galleryQuery } from "@/lib/site-data";
import { LoadingScreen } from "@/components/loading-screen";
import { IntroScreen } from "@/components/intro-screen";
import { Invitation } from "@/components/invitation";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteContentQuery);
    context.queryClient.ensureQueryData(timelineQuery);
    context.queryClient.ensureQueryData(galleryQuery);
  },
  head: () => ({
    meta: [
      { title: "Aaradhya & Arjun — Wedding Invitation" },
      { name: "description", content: "Join us as we celebrate our wedding on December 15, 2026 at The Leela Palace, Udaipur." },
      { property: "og:title", content: "Aaradhya & Arjun — Wedding Invitation" },
      { property: "og:description", content: "December 15, 2026 · The Leela Palace, Udaipur" },
    ],
  }),
  component: Index,
});

function Index() {
  const [opened, setOpened] = useState(false);
  return (
    <Suspense fallback={<LoadingScreen />}>
      {!opened && <IntroScreen brideName="Aaradhya" groomName="Arjun" onOpen={() => setOpened(true)} />}
      <Invitation opened={opened} />
    </Suspense>
  );
}
