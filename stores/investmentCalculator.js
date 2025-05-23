// stores/investmentCalculator.js
import { defineStore } from 'pinia'

export const useInvestmentCalculatorStore = defineStore('investmentCalculator', {
  state: () => ({
    selectedScenario: 'SellerFinancing',
    
    // Subject-To / Hybrid inputs
    subtoInputs: {
      purchasePrice: 0,
      existingLoanBalance: null,
      cashToSeller: 0,
      existingLoanPITI: null,
      includeSellerCarryback: true,
      sellerCarryRate: 5,
      sellerCarryTerm: 30,
      balloonTerm: 5,
      commissionPercent: 6,
      monthlyRent: 0,
      vacancyRate: 5,
      maintenanceRate: 5,
      managementRate: 8,
    },
    
    // Seller Financing inputs
    sellerFinancingInputs: {
      purchasePrice: 0,
      downPaymentAmount: 0, // Changed from downPaymentPercent to downPaymentAmount
      sellerRate: 6,
      sellerTerm: 30,
      balloonTerm: 5,
      commissionPercent: 6,
      monthlyRent: 0,
      propertyTax: 0,
      insurance: 0,
      vacancyRate: 5,
      maintenanceRate: 5,
      managementRate: 8,
    },
    
    // Cash Offer inputs
    cashOfferInputs: {
      offerPrice: 0,
      closingCostsPercent: 1.5,
      closingCostsPaidBy: 'Buyer',
      monthlyRent: 0,
      propertyTax: 0,
      insurance: 0,
      vacancyRate: 5,
      maintenanceRate: 5,
      managementRate: 8,
      customAmount1: 0,
      customAmount2: 0,
      notes: '',
    },
    
    // State for user manual modifications tracking
    sfPriceManuallySet: false,
    sfDownPaymentManuallySet: false,
    cashPriceManuallySet: false,
    showAmortizationSchedule: false,
    
    // Store property data for reference
    propertyData: null,
    reapiPropertyData: null,
  }),
  
  getters: {
    // Subject-To calculations
    subtoCalculated: (state) => {
      const pp = Number(state.subtoInputs.purchasePrice) || 0;
      const loanBal = Number(state.subtoInputs.existingLoanBalance) || 0;
      const cashSeller = Number(state.subtoInputs.cashToSeller) || 0;
      const existingPITI = Number(state.subtoInputs.existingLoanPITI) || 0;
      const includeSellerCarryback = state.subtoInputs.includeSellerCarryback ?? true;
      
      const defaults = {
        sellerCarryAmount: 0,
        sellerCarryMonthlyPayment: 0,
        monthlyPrincipal: 0,
        monthlyInterest: 0,
        totalMonthlyHousingPayment: existingPITI,
        otherOpExMonthly: 0,
        monthlyCashFlow: 0,
        totalCashNeeded: cashSeller,
        cashOnCash: 0,
        balloonPayment: 0,
        commissionAmount: 0, // Add this to show commission separately
      };
      
      if (pp <= 0 || loanBal <= 0) return defaults;
      
      // Calculate commission amount (SELLER ALWAYS PAYS)
      const commissionAmount = pp * (Number(state.subtoInputs.commissionPercent) / 100);
      
      // CORRECTED: Seller Carryback calculation
      // Seller Carryback = Sales Price - Commission - Cash to Seller - Existing Loan Balance
      let sellerCarryAmount = 0;
      if (includeSellerCarryback) {
        sellerCarryAmount = Math.max(0, pp - commissionAmount - cashSeller - loanBal);
      }
      
      // Calculate payments with principal/interest breakdown
      const mortgageDetails = calculateMortgagePayment(
        sellerCarryAmount,
        state.subtoInputs.sellerCarryRate,
        state.subtoInputs.sellerCarryTerm
      );
      const sellerCarryMonthlyPayment = includeSellerCarryback ? mortgageDetails.payment : 0;
      const monthlyPrincipal = includeSellerCarryback ? mortgageDetails.principal : 0;
      const monthlyInterest = includeSellerCarryback ? mortgageDetails.interest : 0;
      const totalMonthlyHousingPayment = existingPITI + sellerCarryMonthlyPayment;
      
      // Calculate balloon payment if applicable
      const balloonPayment = includeSellerCarryback ? calculateBalloonPayment(
        sellerCarryAmount,
        state.subtoInputs.sellerCarryRate,
        state.subtoInputs.sellerCarryTerm,
        state.subtoInputs.balloonTerm
      ) : 0;
      
      const rent = Number(state.subtoInputs.monthlyRent) || 0;
      const vacancyMonthly = rent * (Number(state.subtoInputs.vacancyRate) / 100);
      const maintMonthly = rent * (Number(state.subtoInputs.maintenanceRate) / 100);
      const mgmtMonthly = rent * (Number(state.subtoInputs.managementRate) / 100);
      const otherOpExMonthly = vacancyMonthly + maintMonthly + mgmtMonthly;
      const monthlyCashFlow = rent - totalMonthlyHousingPayment - otherOpExMonthly;
      const annualCashFlow = monthlyCashFlow * 12;
      
      // CORRECTED: Balance to Close
      // Balance to Close = Commission + Cash to Seller
      const totalCashNeeded = commissionAmount + cashSeller;
      
      const cashOnCash = totalCashNeeded > 0 ? (annualCashFlow / totalCashNeeded) * 100 : 0;
      
      return {
        sellerCarryAmount,
        sellerCarryMonthlyPayment,
        monthlyPrincipal,
        monthlyInterest,
        totalMonthlyHousingPayment,
        otherOpExMonthly,
        monthlyCashFlow,
        totalCashNeeded,
        cashOnCash: isNaN(cashOnCash) ? 0 : cashOnCash,
        balloonPayment,
        commissionAmount, // Return this for display purposes
      };
    },
    
    // Seller Financing calculations
    sellerFinancingCalculated: (state) => {
      const pp = Number(state.sellerFinancingInputs.purchasePrice) || 0;
      const downPaymentAmount = Number(state.sellerFinancingInputs.downPaymentAmount) || 0;
      
      const defaults = {
        downPaymentAmount: 0,
        downPaymentPercent: 0, // Added this for display
        sellerNoteAmount: 0,
        monthlyPaymentPI: 0,
        monthlyPrincipal: 0,
        monthlyInterest: 0,
        monthlyTaxInsurance: 0,
        totalMonthlyPITI: 0,
        otherOpExMonthly: 0,
        monthlyCashFlow: 0,
        totalCashNeeded: 0,
        cashOnCash: 0,
        balloonPayment: 0,
        commissionAmount: 0, // Add this to show commission separately
      };
      
      if (pp <= 0) return defaults;
      
      const downPaymentPercent = pp > 0 ? (downPaymentAmount / pp) * 100 : 0;
      
      // Calculate commission amount (SELLER ALWAYS PAYS in seller financing)
      const commissionAmount = pp * (Number(state.sellerFinancingInputs.commissionPercent) / 100);
      
      // UPDATED: Seller Note = Purchase Price - Down Payment - Commission
      const sellerNoteAmount = pp - downPaymentAmount - commissionAmount;
      
      // Calculate payments with principal/interest breakdown
      const mortgageDetails = calculateMortgagePayment(
        sellerNoteAmount,
        state.sellerFinancingInputs.sellerRate,
        state.sellerFinancingInputs.sellerTerm
      );
      const monthlyPaymentPI = mortgageDetails.payment;
      const monthlyPrincipal = mortgageDetails.principal;
      const monthlyInterest = mortgageDetails.interest;
      
      // Calculate balloon payment if applicable
      const balloonPayment = calculateBalloonPayment(
        sellerNoteAmount,
        state.sellerFinancingInputs.sellerRate,
        state.sellerFinancingInputs.sellerTerm,
        state.sellerFinancingInputs.balloonTerm
      );
      
      const taxMonthly = (Number(state.sellerFinancingInputs.propertyTax) || 0) / 12;
      const insMonthly = (Number(state.sellerFinancingInputs.insurance) || 0) / 12;
      const monthlyTaxInsurance = taxMonthly + insMonthly;
      const totalMonthlyPITI = monthlyPaymentPI + monthlyTaxInsurance;
      
      const rent = Number(state.sellerFinancingInputs.monthlyRent) || 0;
      const vacancyMonthly = rent * (Number(state.sellerFinancingInputs.vacancyRate) / 100);
      const maintMonthly = rent * (Number(state.sellerFinancingInputs.maintenanceRate) / 100);
      const mgmtMonthly = rent * (Number(state.sellerFinancingInputs.managementRate) / 100);
      const otherOpExMonthly = vacancyMonthly + maintMonthly + mgmtMonthly;
      const monthlyCashFlow = rent - totalMonthlyPITI - otherOpExMonthly;
      const annualCashFlow = monthlyCashFlow * 12;
      
      // SIMPLIFIED: Balance to Close = Commission + Down Payment
      const totalCashNeeded = commissionAmount + downPaymentAmount;
      
      const cashOnCash = totalCashNeeded > 0 ? (annualCashFlow / totalCashNeeded) * 100 : 0;
      
      return {
        downPaymentAmount,
        downPaymentPercent, // Added this
        sellerNoteAmount,
        monthlyPaymentPI,
        monthlyPrincipal,
        monthlyInterest,
        monthlyTaxInsurance,
        totalMonthlyPITI,
        otherOpExMonthly,
        monthlyCashFlow,
        totalCashNeeded,
        cashOnCash: isNaN(cashOnCash) ? 0 : cashOnCash,
        balloonPayment,
        commissionAmount, // Added this
      };
    },
    
    // Cash Offer calculations
    cashOfferCalculated: (state) => {
      const offerPrice = Number(state.cashOfferInputs.offerPrice) || 0;
      const customAmount1 = Number(state.cashOfferInputs.customAmount1) || 0;
      const customAmount2 = Number(state.cashOfferInputs.customAmount2) || 0;
      
      const defaults = {
        closingCostsAmount: 0,
        additionalCosts: 0,
        totalCashNeeded: 0,
        annualNOI: 0,
        monthlyCashFlow: 0,
        capRate: 0,
        cashOnCash: 0,
      };
      
      if (offerPrice <= 0) return defaults;
      
      let buyerClosingCosts = 0;
      if (
        state.cashOfferInputs.closingCostsPaidBy === 'Buyer' ||
        state.cashOfferInputs.closingCostsPaidBy === 'Split'
      ) {
        buyerClosingCosts = offerPrice * (Number(state.cashOfferInputs.closingCostsPercent) / 100);
        if (state.cashOfferInputs.closingCostsPaidBy === 'Split') buyerClosingCosts /= 2;
      }
      
      const closingCostsAmount = buyerClosingCosts;
      const additionalCosts = customAmount1 + customAmount2;
      const totalCashNeeded = offerPrice + closingCostsAmount + additionalCosts;
      
      const rent = Number(state.cashOfferInputs.monthlyRent) || 0;
      const annualGrossRent = rent * 12;
      const taxAnnual = Number(state.cashOfferInputs.propertyTax) || 0;
      const insAnnual = Number(state.cashOfferInputs.insurance) || 0;
      const vacancyAnnual = annualGrossRent * (Number(state.cashOfferInputs.vacancyRate) / 100);
      const maintAnnual = annualGrossRent * (Number(state.cashOfferInputs.maintenanceRate) / 100);
      const mgmtAnnual = annualGrossRent * (Number(state.cashOfferInputs.managementRate) / 100);
      const totalAnnualOpEx = taxAnnual + insAnnual + vacancyAnnual + maintAnnual + mgmtAnnual;
      const annualNOI = annualGrossRent - totalAnnualOpEx;
      const monthlyCashFlow = annualNOI / 12;
      const annualCashFlow = annualNOI;
      const capRate = offerPrice > 0 ? (annualNOI / offerPrice) * 100 : 0;
      const cashOnCash = totalCashNeeded > 0 ? (annualCashFlow / totalCashNeeded) * 100 : 0;
      
      return {
        closingCostsAmount,
        additionalCosts,
        totalCashNeeded,
        annualNOI,
        monthlyCashFlow,
        capRate: isNaN(capRate) ? 0 : capRate,
        cashOnCash: isNaN(cashOnCash) ? 0 : cashOnCash,
      };
    },
    
    // Amortization schedules
    sellerFinancingAmortizationSchedule: (state) => {
      return generateAmortizationSchedule(
        state.sellerFinancingCalculated.sellerNoteAmount,
        state.sellerFinancingInputs.sellerRate,
        state.sellerFinancingInputs.sellerTerm
      );
    },
    
    subtoAmortizationSchedule: (state) => {
      return generateAmortizationSchedule(
        state.subtoCalculated.sellerCarryAmount,
        state.subtoInputs.sellerCarryRate,
        state.subtoInputs.sellerCarryTerm
      );
    }
  },
  
  actions: {
    setSelectedScenario(scenario) {
      this.selectedScenario = scenario;
    },
    
    updateSubtoInputs(inputs) {
      this.subtoInputs = { ...this.subtoInputs, ...inputs };
    },
    
    updateSellerFinancingInputs(inputs) {
      this.sellerFinancingInputs = { ...this.sellerFinancingInputs, ...inputs };
    },
    
    updateCashOfferInputs(inputs) {
      this.cashOfferInputs = { ...this.cashOfferInputs, ...inputs };
    },
    
    toggleAmortizationSchedule() {
      this.showAmortizationSchedule = !this.showAmortizationSchedule;
    },
    
    setPropertyData(property, reapiProperty) {
      this.propertyData = property;
      this.reapiPropertyData = reapiProperty;
      this.prefillDataFromProperty();
    },
    
    prefillDataFromProperty() {
      if (!this.propertyData && !this.reapiPropertyData) return;
      
      // Check if property is actively for sale
      const isForSale = this.reapiPropertyData?.mls_active === true;
      
      // Use list price when for sale, otherwise use estimated values
      const estPrice = isForSale
        ? Number(this.propertyData?.price) || 0
        : Number(this.reapiPropertyData?.estimatedValue) || 
          Number(this.propertyData?.zestimate) || 
          Number(this.propertyData?.price) || 
          0;
                       
      // Get rent estimate from Zillow or REAPI demographics
      const estRent = Number(this.propertyData?.rentZestimate) || 
                      Number(this.reapiPropertyData?.demographics?.suggestedRent) || 
                      0;
                      
      // Get tax info from property data or REAPI
      const estTax = Number(this.propertyData?.taxAnnualAmount) ||
                     Number(this.propertyData?.resoFacts?.taxAnnualAmount) ||
                     Number(this.reapiPropertyData?.taxInfo?.taxAmount) ||
                     0;
                     
      const estInsurance = Number(this.propertyData?.annualHomeownersInsurance) || 1200; // Default if unavailable
      
      // Pre-fill common fields if they are currently 0
      if (this.subtoInputs.monthlyRent === 0) this.subtoInputs.monthlyRent = estRent;
      if (this.sellerFinancingInputs.monthlyRent === 0) this.sellerFinancingInputs.monthlyRent = estRent;
      if (this.cashOfferInputs.monthlyRent === 0) this.cashOfferInputs.monthlyRent = estRent;
      if (this.sellerFinancingInputs.propertyTax === 0) this.sellerFinancingInputs.propertyTax = estTax;
      if (this.cashOfferInputs.propertyTax === 0) this.cashOfferInputs.propertyTax = estTax;
      if (this.sellerFinancingInputs.insurance === 0) this.sellerFinancingInputs.insurance = estInsurance;
      if (this.cashOfferInputs.insurance === 0) this.cashOfferInputs.insurance = estInsurance;
      
      // Pre-fill Scenario Specific Prices
      if (this.subtoInputs.purchasePrice === 0) this.subtoInputs.purchasePrice = estPrice;
      if (!this.sfPriceManuallySet && this.sellerFinancingInputs.purchasePrice === 0 && estPrice > 0) {
        this.sellerFinancingInputs.purchasePrice = Math.round(estPrice * 1.1);
      }
      
      // UPDATED: Set default down payment to 6% of purchase price as a dollar amount
      if (!this.sfDownPaymentManuallySet && estPrice > 0) {
        this.sellerFinancingInputs.downPaymentAmount = Math.round(estPrice * 1.1 * 0.06);
      }
      
      if (!this.cashPriceManuallySet && this.cashOfferInputs.offerPrice === 0 && estPrice > 0) {
        this.cashOfferInputs.offerPrice = Math.round(estPrice * 0.7);
      }
    },
    
    autoFillMortgageData() {
      // Check if reapi_property data is available
      if (this.reapiPropertyData) {
        // Fill in existing loan balance from estimatedMortgageBalance or openMortgageBalance
        if (this.reapiPropertyData.estimatedMortgageBalance) {
          this.subtoInputs.existingLoanBalance = Number(this.reapiPropertyData.estimatedMortgageBalance);
        } else if (this.reapiPropertyData.openMortgageBalance) {
          this.subtoInputs.existingLoanBalance = Number(this.reapiPropertyData.openMortgageBalance);
        }
        
        // Fill in monthly payment from estimatedMortgagePayment
        if (this.reapiPropertyData.estimatedMortgagePayment) {
          this.subtoInputs.existingLoanPITI = Number(this.reapiPropertyData.estimatedMortgagePayment);
        }
        
        // If we didn't find the data in the main object, check currentMortgages array
        if (!this.subtoInputs.existingLoanBalance && this.reapiPropertyData.currentMortgages?.length) {
          // Use the first mortgage (typically the primary one)
          const primaryMortgage = this.reapiPropertyData.currentMortgages[0];
          if (primaryMortgage.amount) {
            this.subtoInputs.existingLoanBalance = Number(primaryMortgage.amount);
          }
        }
      }
    },
    
    setSfPriceManuallySet(value) {
      this.sfPriceManuallySet = value;
    },
    
    setSfDownPaymentManuallySet(value) {
      this.sfDownPaymentManuallySet = value;
    },
    
    setCashPriceManuallySet(value) {
      this.cashPriceManuallySet = value;
    },
    
    resetSubtoExistingLoanBalance() {
      this.subtoInputs.existingLoanBalance = null;
    }
  }
})

// Helper Functions (outside of store but needed for calculations)
function calculateMortgagePayment(principal, annualRatePercent, termYears) {
  if (!principal || principal <= 0 || !termYears || termYears <= 0)
    return { payment: 0, principal: 0, interest: 0 };
  
  // Ensure rate is treated as 0 if null/undefined
  const rate = annualRatePercent == null ? 0 : annualRatePercent;
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = termYears * 12;
  
  if (monthlyRate === 0) {
    // Handle 0% interest rate
    const payment = numberOfPayments > 0 ? principal / numberOfPayments : 0;
    return { payment, principal: payment, interest: 0 };
  }
  
  // Standard mortgage formula
  const factor = Math.pow(1 + monthlyRate, numberOfPayments);
  const payment = (principal * (monthlyRate * factor)) / (factor - 1);
  
  // Calculate first month's interest
  const interest = principal * monthlyRate;
  const principalPayment = payment - interest;
  
  return {
    payment,
    principal: principalPayment,
    interest,
  };
}

function calculateBalloonPayment(
  loanAmount,
  annualRatePercent,
  fullTermYears,
  balloonTermYears
) {
  if (
    !loanAmount ||
    loanAmount <= 0 ||
    !fullTermYears ||
    fullTermYears <= 0 ||
    !balloonTermYears
  )
    return 0;
  
  if (balloonTermYears >= fullTermYears) return 0; // No balloon if term equals or exceeds full amortization
  
  const rate = annualRatePercent == null ? 0 : annualRatePercent;
  const monthlyRate = rate / 100 / 12;
  
  if (monthlyRate === 0) {
    // Handle 0% interest rate
    const monthlyPayment = loanAmount / (fullTermYears * 12);
    const paidAmount = monthlyPayment * (balloonTermYears * 12);
    return loanAmount - paidAmount;
  }
  
  // Calculate regular monthly payment based on full amortization
  const monthlyPayment = calculateMortgagePayment(
    loanAmount,
    annualRatePercent,
    fullTermYears
  ).payment;
  
  // Calculate remaining balance after balloon term
  let balance = loanAmount;
  const balloonMonths = balloonTermYears * 12;
  
  for (let i = 0; i < balloonMonths; i++) {
    const interestPart = balance * monthlyRate;
    const principalPart = monthlyPayment - interestPart;
    balance -= principalPart;
  }
  
  return Math.max(0, balance);
}

function generateAmortizationSchedule(loanAmount, interestRate, termYears) {
  if (!loanAmount || loanAmount <= 0 || !termYears || termYears <= 0) return [];
  
  const rate = interestRate == null ? 0 : interestRate;
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = termYears * 12;
  
  // Calculate payment
  let monthlyPayment;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / numberOfPayments;
  } else {
    const factor = Math.pow(1 + monthlyRate, numberOfPayments);
    monthlyPayment = (loanAmount * (monthlyRate * factor)) / (factor - 1);
  }
  
  // Generate schedule
  const schedule = [];
  let remainingBalance = loanAmount;
  let totalInterest = 0;
  let totalPrincipal = 0;
  
  for (let month = 1; month <= numberOfPayments; month++) {
    // Calculate interest for this period
    const interest = monthlyRate === 0 ? 0 : remainingBalance * monthlyRate;
    const principal = monthlyPayment - interest;
    
    // Update balances
    remainingBalance -= principal;
    totalInterest += interest;
    totalPrincipal += principal;
    
    // Add to schedule (only include certain intervals to keep it manageable)
    const year = Math.ceil(month / 12);
    const monthOfYear = ((month - 1) % 12) + 1;
    
    // Include first payment of each year, last payment, and any balloon payment
    if (monthOfYear === 1 || month === numberOfPayments) {
      schedule.push({
        payment: month,
        year,
        month: monthOfYear,
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        totalPayment: monthlyPayment.toFixed(2),
        remainingBalance: Math.max(0, remainingBalance).toFixed(2),
        totalInterestPaid: totalInterest.toFixed(2),
      });
    }
  }
  
  return schedule;
}