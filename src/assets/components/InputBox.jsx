import React, { useId } from 'react'

function InputBox({
    label,
    amount,
    onAmountChange,
    onCurrencyChange,
    currencyOptions = [],
    selectCurrency = "usd",
    amountDisable = false,
    currencyDisable = false,
    className = "",
}) {
   const amountInputId = useId()

    return (
        <div className={`bg-white/10 border border-white/20 backdrop-blur-md p-4 rounded-2xl text-sm flex transition-all duration-300 hover:bg-white/15 focus-within:border-indigo-400 focus-within:shadow-lg focus-within:shadow-indigo-500/30 ${className}`}>
            <div className="w-1/2">
                <label htmlFor={amountInputId} className="text-indigo-200/70 mb-2 inline-block uppercase tracking-wider text-xs">
                    {label}
                </label>
                <input
                    id={amountInputId}
                    className="outline-none w-full bg-transparent py-1.5 text-white text-lg font-semibold placeholder-white/30"
                    type="number"
                    placeholder="Amount"
                    disabled={amountDisable}
                    value={amount}
                    onChange={(e) => onAmountChange && onAmountChange(Number(e.target.value))}
                />
            </div>
            <div className="w-1/2 flex flex-wrap justify-end text-right">
                <p className="text-indigo-200/70 mb-2 w-full uppercase tracking-wider text-xs">Currency Type</p>
                <select
                    className="rounded-lg px-2 py-1.5 bg-white/15 text-white cursor-pointer outline-none border border-white/20 hover:bg-white/25 transition-colors uppercase"
                    value={selectCurrency}
                    onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
                    disabled={currencyDisable}
                >
                    {currencyOptions.map((currency) => (
                        <option key={currency} value={currency} className="bg-slate-900 text-white">
                            {currency}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default InputBox;