"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Calculator, DollarSign, Percent, Calendar, PiggyBank, TrendingUp } from 'lucide-react'

interface MortgageCalculatorProps {
  propertyPrice: number
  className?: string
}

export function MortgageCalculator({ propertyPrice, className }: MortgageCalculatorProps) {
  const [homePrice, setHomePrice] = useState(propertyPrice)
  const [downPayment, setDownPayment] = useState(Math.round(propertyPrice * 0.2))
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [propertyTax, setPropertyTax] = useState(Math.round(propertyPrice * 0.012 / 12))
  const [insurance, setInsurance] = useState(Math.round(propertyPrice * 0.005 / 12))

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
          Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Payment Summary */}
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Estimated Monthly Payment</p>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrencyDetailed(monthlyPayment)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Principal & Interest: {formatCurrencyDetailed(monthlyPI)}
          </p>
        </div>

        {/* Home Price */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            Home Price
          </Label>
          <Input
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(Number(e.target.value) || 0)}
            className="text-lg font-semibold"
          />
        </div>

        {/* Down Payment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-gray-500" />
              Down Payment
            </Label>
            <span className="text-sm font-medium text-blue-600">
              {downPaymentPercent}% ({formatCurrency(downPayment)})
            </span>
          </div>
          <Slider
            value={[downPaymentPercent]}
            onValueChange={(value) => setDownPaymentPercent(value[0])}
            min={0}
            max={50}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Loan Amount Display */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Loan Amount</span>
            <span className="font-semibold">{formatCurrency(loanAmount)}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-gray-500" />
              Interest Rate
            </Label>
            <span className="text-sm font-medium text-blue-600">{interestRate}%</span>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            min={2}
            max={12}
            step={0.125}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>2%</span>
            <span>7%</span>
            <span>12%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            Loan Term
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[15, 20, 30].map((term) => (
              <button
                key={term}
                onClick={() => setLoanTerm(term)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  loanTerm === term
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {term} years
              </button>
            ))}
          </div>
        </div>

        {/* Additional Costs */}
        <div className="space-y-3 border-t pt-4">
          <p className="text-sm font-medium text-gray-700">Monthly Costs (included above)</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500">Property Tax</Label>
              <Input
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(Number(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Home Insurance</Label>
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
            Payment Breakdown
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Principal & Interest</span>
              <span className="font-medium">{formatCurrencyDetailed(monthlyPI)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Property Tax</span>
              <span className="font-medium">{formatCurrencyDetailed(propertyTax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Insurance</span>
              <span className="font-medium">{formatCurrencyDetailed(insurance)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total Monthly</span>
              <span className="text-blue-600">{formatCurrencyDetailed(monthlyPayment)}</span>
            </div>
          </div>
        </div>

        {/* Loan Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">Loan Summary</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total of Payments</p>
              <p className="font-semibold">{formatCurrency(totalPayment)}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Interest Paid</p>
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
