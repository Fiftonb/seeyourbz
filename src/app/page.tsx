import { SolarDay } from 'tyme4ts'
import { CalendarDemo } from '@/components/CalendarDemo'

export default function Home() {
  const today = SolarDay.fromYmd(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0">
            <h1 className="text-4xl font-bold">SeeYourBz</h1>
          </div>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:translate-y-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">今日日历</h2>
          <div className="space-y-2">
            <p className="text-lg">公历：{today.toString()}</p>
            <p className="text-lg">农历：{today.getLunarDay().toString()}</p>
            <p className="text-lg">干支：{today.getLunarDay().getSixtyCycleDay().toString()}</p>
          </div>
        </div>
      </div>

      <CalendarDemo />
    </main>
  )
} 