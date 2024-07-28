import dynamic from "next/dynamic";

const WebCAD = dynamic(() => import("@/components/WebCAD").then(({ WebCAD }) => WebCAD), {
  loading: () => <p>Loading editor...</p>,
  ssr: false,
});

export default function Home() {
  return (
    <main className="w-screen h-screen">
      <WebCAD />
    </main>
  );
}
