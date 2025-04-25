import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800
    dark:to-slate-900 text-slate-900 dark:text-white p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text2xl font-bold mb-4 md:mb-0">WeatherWise</h1>
        </div>
      </div>
      </main>
  );
}
