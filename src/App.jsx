import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { InputBox } from './assets/components'
import ThreeBackground from './assets/components/ThreeBackground'
import useCurrencyInfo from './hooks/useCurrencyInfo'

function App() {

  const [amount, setAmount] = useState("")
  const [from, setFrom] = useState("usd")
  const [to, setTo] = useState("inr")
  const [convertedAmount, setConvertedAmount] = useState(0)

  const currencyInfo = useCurrencyInfo(from)

  const options = Object.keys(currencyInfo)

  const cardRef = useRef(null)
  const swapRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 80, opacity: 0, scale: 0.9, duration: 1.1, ease: 'power3.out',
      })
      gsap.from('.anim-item', {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.15, delay: 0.4, ease: 'power3.out',
      })
    }, cardRef)
    return () => ctx.revert()
  }, [])

  const swap = () => {
    setFrom(to)
    setTo(from)
    setConvertedAmount(amount)
    setAmount(convertedAmount)
    gsap.fromTo(swapRef.current, { rotate: 0 }, { rotate: 360, duration: 0.7, ease: 'back.out(1.7)' })
  }

  const convert = () => {
    setConvertedAmount(amount * currencyInfo[to])
    gsap.fromTo('.result-box', { scale: 0.96 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  return (
    <div className="relative w-full h-screen flex justify-center items-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <ThreeBackground />

      <div className="relative z-10 w-full px-4">
        <div
          ref={cardRef}
          className="w-full max-w-md mx-auto rounded-3xl p-6 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-indigo-500/30"
        >
          <h1 className="anim-item text-center text-2xl font-bold tracking-wide mb-5 bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Currency Converter
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              convert()
            }}
          >
            <div className="anim-item w-full mb-1">
              <InputBox
                label="From"
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setFrom(currency)}
                selectCurrency={from}
                onAmountChange={(amount) => setAmount(amount)}
              />
            </div>

            <div className="relative w-full h-0.5">
              <button
                ref={swapRef}
                type="button"
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full border-2 border-white/70 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 text-sm font-semibold shadow-lg shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-transform"
                onClick={swap}
              >
                swap
              </button>
            </div>

            <div className="anim-item result-box w-full mt-1 mb-5">
              <InputBox
                label="To"
                amount={convertedAmount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setTo(currency)}
                selectCurrency={to}
                amountDisable
              />
            </div>

            <button
              type="submit"
              className="anim-item w-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-semibold px-4 py-3 shadow-lg shadow-purple-500/40 hover:shadow-purple-500/70 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
            >
              Convert {from.toUpperCase()} to {to.toUpperCase()}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App