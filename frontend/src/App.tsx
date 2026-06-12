import Footer from "./components/Footer";
import Header from "./components/Header";
import LogList from "./components/LogList";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1 px-8 py-8">
        <LogList />
      </main>
      <Footer />
    </div>
  );
}
