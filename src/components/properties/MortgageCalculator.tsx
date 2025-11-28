"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Calculator, DollarSign, Percent, Calendar, PiggyBank, TrendingUp, Info } from 'lucide-react'

interface MortgageProgram {
  id: string
  name: string
  rate: number
  description: string
}

interface MortgageCalculatorProps {
  propertyPrice: number
  className?: string
}

export function MortgageCalculator({ propertyPrice, className }: MortgageCalculatorProps) {
  const t = useTranslations('mortgage')

  // Mortgage programs with different rates
  const mortgagePrograms: MortgageProgram[] = [
    { id: 'standard', name: t('programs.standard'), rate: 10.5, description: t('programs.standardDesc') },
    { id: 'family', name: t('programs.family'), rate: 6.0, description: t('programs.familyDesc') },
    { id: 'it', name: t('programs.it'), rate: 5.0, description: t('programs.itDesc') },
    { id: 'military', name: t('programs.military'), rate: 4.5, description: t('programs.militaryDesc') },
  ]

  const [selectedProgram, setSelectedProgram] = useState<string>('standard')
  const [homePrice, setHomePrice] = useState(propertyPrice)
  const [downPayment, setDownPayment] = useState(Math.round(propertyPrice * 0.2))
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [interestRate, setInterestRate] = useState(mortgagePrograms[0].rate)
  const [customRate, setCustomRate] = useState(false)
  const [loanTerm, setLoanTerm] = useState(30)
  const [propertyTax, setPropertyTax] = useState(Math.round(propertyPrice * 0.012 / 12))
  const [insurance, setInsurance] = useState(Math.round(propertyPrice * 0.005 / 12))

  // Quick percentage options for down payment
  const downPaymentOptions = [20, 30, 40, 50]
  // Quick year options for loan term
  const loanTermOptions = [10, 20, 30]

  // Update interest rate when program changes
  useEffect(() => {
    if (!customRate) {
      const program = mortgagePrograms.find(p => p.id === selectedProgram)
      if (program) {
        setInterestRate(program.rate)
      }
    }
  }, [selectedProgram, customRate])

  // Update down payment when percent changes
  useEffect(() => {
    setDownPayment(Math.round(homePrice * (downPaymentPercent / 100)))
  }, [downPaymentPercent, homePrice])

  // Calculate mortgage details
  const loanAmount = homePrice - downPayment
  const monthlyInterestRate = interestRate / 100 / 12
  const numberOfPayments = loanTerm * 12

  // Monthly principal and interest payment (standard amortization formula)
  const monthlyPI = monthlyInterestRate > 0
    ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    : loanAmount / numberOfPayments

  const monthlyPayment = monthlyPI + propertyTax + insurance
  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = (monthlyPI * numberOfPayments) - loanAmount

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatCurrencyDetailed = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Payment Summary */}
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">{t('monthlyPayment')}</p>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrencyDetailed(monthlyPayment)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {t('principal')}: {formatCurrencyDetailed(monthlyPI)}
          </p>
        </div>

        {/* Home Price */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            {t('homePrice')}
          </Label>
          <div className="relative">
            <Input
              type="text"
              value={homePrice.toLocaleString()}
              onChange={(e) => setHomePrice(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)}
              className="text-lg font-semibold pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
          </div>
        </div>

        {/* Mortgage Programs */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-gray-500" />
            {t('programs.title')}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {mortgagePrograms.map((program) => (
              <button
                key={program.id}
                onClick={() => {
                  setSelectedProgram(program.id)
                  setCustomRate(false)
                }}
                title={program.description}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                  selectedProgram === program.id && !customRate
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span>{program.name}</span>
                  <span className={`text-xs ${selectedProgram === program.id && !customRate ? 'text-blue-100' : 'text-blue-600'}`}>
                    {program.rate}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Down Payment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-gray-500" />
              {t('downPayment')}
            </Label>
            <span className="text-sm font-medium text-blue-600">
              {formatCurrency(downPayment)}
            </span>
          </div>
          <div className="relative">
            <Input
              type="text"
              value={downPayment.toLocaleString()}
              onChange={(e) => {
                const value = Number(e.target.value.replace(/[^0-9]/g, '')) || 0
                setDownPayment(value)
                setDownPaymentPercent(Math.round((value / homePrice) * 100 * 10) / 10)
              }}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
          </div>
          {/* Quick percentage buttons */}
          <div className="flex gap-2">
            {downPaymentOptions.map((percent) => (
              <button
                key={percent}
                onClick={() => setDownPaymentPercent(percent)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-sm font-medium transition-colors border ${
                  Math.abs(downPaymentPercent - percent) < 0.5
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                {percent}%
              </button>
            ))}
          </div>
        </div>

        {/* Loan Amount Display */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('loanAmount')}</span>
            <span className="font-semibold">{formatCurrency(loanAmount)}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-gray-500" />
              {t('interestRate')}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => {
                  setInterestRate(Number(e.target.value) || 0)
                  setCustomRate(true)
                }}
                className="w-20 h-8 text-sm text-right"
                step={0.1}
                min={0}
                max={30}
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => {
              setInterestRate(value[0])
              setCustomRate(true)
            }}
            min={2}
            max={15}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>2%</span>
            <span>8%</span>
            <span>15%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              {t('loanTerm')}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value) || 1)}
                className="w-16 h-8 text-sm text-right"
                min={1}
                max={50}
              />
              <span className="text-sm text-gray-500">{t('years')}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {loanTermOptions.map((term) => (
              <button
                key={term}
                onClick={() => setLoanTerm(term)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors border ${
                  loanTerm === term
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                {term} {t('years')}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Costs */}
        <div className="space-y-3 border-t pt-4">
          <p className="text-sm font-medium text-gray-700">{t('breakdown')}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500">{t('propertyTax')}</Label>
              <Input
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(Number(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">{t('insurance')}</Label>
              <Input
                type="number"
                value={insurance}
                onChange={(e) => setInsurance(Number(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="space-y-2 border-t pt-4">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('breakdown')}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('principal')}</span>
              <span className="font-medium">{formatCurrencyDetailed(monthlyPI)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertyTax')}</span>
              <span className="font-medium">{formatCurrencyDetailed(propertyTax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('insurance')}</span>
              <span className="font-medium">{formatCurrencyDetailed(insurance)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>{t('monthlyPayment')}</span>
              <span className="text-blue-600">{formatCurrencyDetailed(monthlyPayment)}</span>
            </div>
          </div>
        </div>

        {/* Loan Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">{t('loanSummary')}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">{t('totalPayment')}</p>
              <p className="font-semibold">{formatCurrency(totalPayment)}</p>
            </div>
            <div>
              <p className="text-gray-500">{t('totalInterest')}</p>
              <p className="font-semibold text-orange-600">{formatCurrency(totalInterest)}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">
          * This is an estimate. Actual payments may vary based on lender, credit score, and other factors.
        </p>
      </CardContent>
    </Card>
  )
}
