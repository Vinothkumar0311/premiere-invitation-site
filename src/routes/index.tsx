import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
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
  return (
    <Suspense fallback={<LoadingScreen />}>
      <InvitationGate />
    </Suspense>
  );
}

function InvitationGate() {
  const [opened, setOpened] = useState(false);
  const { data: site } = useSuspenseQuery(siteContentQuery);
  return (
    <>
      {!opened && <IntroScreen brideName={site.bride_name} groomName={site.groom_name} onOpen={() => setOpened(true)} />}
      <Invitation opened={opened} />
    </>
  );
}
