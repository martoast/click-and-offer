// server/api/ai-chat.post.js - SIMPLIFIED VERSION WITHOUT SSE
import { OpenAI } from "openai";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const openai = new OpenAI({
      apiKey: config.openaiApiKey || process.env.OPENAI_API_KEY,
    });
    
    const body = await readBody(event);
    const { messages, property, threadId } = body;
    
    // Get the last user message
    const lastUserMessage = messages.findLast(m => m.role === 'user');
    
    if (!lastUserMessage) {
      return {
        status: "error",
        message: "No user message found."
      };
    }
    
    // Thread management
    let thread;
    try {
      if (threadId) {
        thread = { id: threadId };
      } else {
        // Create a new thread with enhanced property information
        const propertyContext = createEnhancedPropertyContext(property);
        
        thread = await openai.beta.threads.create({
          messages: [
            {
              role: "user",
              content: `Here is the property information I'm looking at: ${propertyContext}`,
            },
          ],
        });
      }
      
      // Add the user's message to the thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: lastUserMessage.content,
      });
      
      // Run the assistant on the thread
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: "asst_CaIzxIdsJrvtLjicLpKhZny0",
      });
      
      // Poll for the run to complete
      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      // Improved polling with exponential backoff
      let attempts = 0;
      const maxAttempts = 30;
      
      while (!["completed", "failed", "cancelled", "expired"].includes(runStatus.status) && attempts < maxAttempts) {
        // Exponential backoff with jitter
        const baseDelay = Math.min(1000 * Math.pow(1.5, attempts), 8000);
        const jitter = Math.random() * 1000;
        const delay = baseDelay + jitter;
        
        await new Promise(resolve => setTimeout(resolve, delay));
        attempts++;
        
        try {
          runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        } catch (pollError) {
          console.error("Error polling for run status:", pollError);
          // If we hit an error, wait a bit longer before retrying
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
      
      if (runStatus.status !== "completed") {
        return {
          status: "error",
          message: `Assistant run failed with status: ${runStatus.status}`,
          threadId: thread.id
        };
      }
      
      // Get the latest messages from the thread
      const messagesResponse = await openai.beta.threads.messages.list(thread.id, {
        limit: 1,
        order: "desc",
      });
      
      const latestMessage = messagesResponse.data[0];
      
      // Return the final result
      return {
        status: "success",
        message: {
          role: "assistant",
          content: latestMessage.content[0].text.value,
        },
        threadId: thread.id
      };
      
    } catch (threadError) {
      console.error("Thread processing error:", threadError);
      return {
        status: "error",
        message: "Error processing your request with the AI assistant.",
        details: threadError.message
      };
    }
    
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return {
      status: "error",
      message: "Failed to get a response from the AI.",
      error: error.message
    };
  }
});

// Enhanced helper function to format property information
function createEnhancedPropertyContext(property) {
  if (!property) return "No property information available.";
  
  // Get both Zillow and REAPI data
  const zillow = property.zillow || {};
  
  // Access REAPI data directly from the property object
  const propertyInfo = property.propertyInfo || {};
  const lotInfo = property.lotInfo || {};
  const ownerInfo = property.ownerInfo || {};
  const lastSale = property.lastSale || {};
  const currentMortgages = property.currentMortgages || [];
  const demographics = property.demographics || {};
  const taxInfo = property.taxInfo || {};
  const schools = property.schools || [];
  
  // Address information
  const address = propertyInfo.address?.label || zillow.streetAddress || "Unknown address";
  const city = propertyInfo.address?.city || zillow.city || zillow.address?.city || "Unknown";
  const state = propertyInfo.address?.state || zillow.state || zillow.address?.state || "Unknown";
  const zip = propertyInfo.address?.zip || zillow.zipcode || zillow.address?.zipcode || "Unknown";
  const county = propertyInfo.address?.county || zillow.county || "Unknown";
  
  // Basic property details
  const price = zillow.price || propertyInfo.price || "Unknown";
  const bedrooms = zillow.bedrooms || propertyInfo.bedrooms || "Unknown";
  const bathrooms = zillow.bathrooms || propertyInfo.bathrooms || "Unknown";
  const squareFeet = zillow.livingArea || zillow.livingAreaValue || propertyInfo.livingSquareFeet || propertyInfo.squareFootage || "Unknown";
  const yearBuilt = zillow.yearBuilt || propertyInfo.yearBuilt || "Unknown";
  const propertyType = zillow.homeType || propertyInfo.propertyType || "Unknown";
  const lotSize = lotInfo.lotSquareFeet || zillow.resoFacts?.lotSize || zillow.lotAreaValue || zillow.lotSize || "Unknown";
  const zoning = lotInfo.zoning || propertyInfo.zoning || zillow.resoFacts?.zoning || "Unknown";
  
  // Financial details
  const zestimate = zillow.zestimate || "Unknown";
  const rentZestimate = zillow.rentZestimate || "Unknown";
  const suggestedRent = demographics?.suggestedRent || rentZestimate || "Unknown";
  const lastSalePrice = lastSale.saleAmount || zillow.lastSalePrice || "Unknown";
  const lastSaleDate = lastSale.saleDate || zillow.lastSaleDate || "Unknown";
  const estimatedValue = property.estimatedValue || zestimate || "Unknown";
  const estimatedEquity = property.equity || property.estimatedEquity || "Unknown";
  const equityPercent = property.equityPercent || "Unknown";
  
  // Tax information
  const taxAmount = taxInfo.taxAmount || "Unknown";
  const assessedValue = taxInfo.assessedValue || "Unknown";
  
  // Mortgage information
  const openLoanBalance = property.openMortgageBalance || property.estimatedMortgageBalance || "Unknown";
  const estimatedMortgagePayment = property.estimatedMortgagePayment || "Unknown";
  
  // Owner information
  const ownerName = ownerInfo.owner1FullName || "Unknown";
  
  // Transaction history
  let transactionHistory = "No transaction history available.";
  if (property.saleHistory && property.saleHistory.length > 0) {
    transactionHistory = "Transaction History:\n";
    property.saleHistory.slice(0, 3).forEach((transaction, index) => {
      transactionHistory += `
        Transaction ${index + 1}:
        Date: ${transaction.saleDate || "Unknown"}
        Price: ${transaction.saleAmount || "Unknown"}
        Buyer: ${transaction.buyerNames || "Unknown"}
        Seller: ${transaction.sellerNames || "Unknown"}
        Type: ${transaction.transactionType || "Unknown"}
      `;
    });
  }
  
  // Mortgage details if available
  let mortgageDetails = "No mortgage information available.";
  if (currentMortgages && currentMortgages.length > 0) {
    const mortgage = currentMortgages[0];
    mortgageDetails = `
      Lender: ${mortgage.lenderName || "Unknown"}
      Loan Amount: ${mortgage.amount || mortgage.loanAmount || "Unknown"}
      Loan Type: ${mortgage.loanType || "Unknown"}
      Interest Rate: ${mortgage.interestRate || "Unknown"}
      Maturity Date: ${mortgage.maturityDate || "Unknown"}
    `;
  }
  
  // Comparable properties
  let compsInfo = "No comparable properties information available.";
  if (property.comps && property.comps.length > 0) {
    // Calculate average values for comps to determine ARV
    const validComps = property.comps.filter(comp => 
      comp.squareFeet && (comp.lastSaleAmount || comp.estimatedValue));
    
    if (validComps.length > 0) {
      const avgSqFtPrice = validComps.reduce((sum, comp) => 
        sum + (parseFloat(comp.estimatedValue) / parseFloat(comp.squareFeet)), 0) / validComps.length;
      
      const avgSalePrice = validComps.reduce((sum, comp) => 
        sum + parseFloat(comp.lastSaleAmount || comp.estimatedValue), 0) / validComps.length;
      
      const potentialARV = Math.round(avgSqFtPrice * parseFloat(squareFeet));
      
      compsInfo = `Comparable Properties Analysis:
      Average Price Per SqFt: $${Math.round(avgSqFtPrice)}
      Average Sale Price: $${Math.round(avgSalePrice)}
      Potential ARV (After Repair Value): $${potentialARV}
      
      Recent Comparable Sales:`;
      
      // Add individual comp details
      property.comps.slice(0, 3).forEach((comp, index) => {
        const compAddress = comp.address?.label || 
          `${comp.address?.address || ''}, ${comp.address?.city || ''}, ${comp.address?.state || ''} ${comp.address?.zip || ''}`;
        
        compsInfo += `
        Comp ${index + 1}:
        Address: ${compAddress}
        Price: $${comp.lastSaleAmount || comp.estimatedValue || "Unknown"}
        Sq Ft: ${comp.squareFeet || "Unknown"}
        Bed/Bath: ${comp.bedrooms || "Unknown"}/${comp.bathrooms || "Unknown"}
        Year Built: ${comp.yearBuilt || "Unknown"}
        Price/SqFt: $${comp.squareFeet ? Math.round((parseFloat(comp.lastSaleAmount || comp.estimatedValue) / parseFloat(comp.squareFeet))) : "Unknown"}
        `;
      });
    }
  }
  
  // Description
  const description = zillow.description || propertyInfo.description || "No description available.";
  
  // Rental information
  const suggestedRentNum = parseFloat(suggestedRent) || 0;
  const estimatedMortgagePaymentNum = parseFloat(estimatedMortgagePayment) || 0;
  
  const rentInfo = `
    Suggested Monthly Rent: $${suggestedRent}
    Potential Gross Annual Rental Income: $${suggestedRentNum * 12}
    Estimated Monthly Mortgage Payment: $${estimatedMortgagePayment}
    Potential Monthly Cashflow (before expenses): $${suggestedRentNum - estimatedMortgagePaymentNum}
  `;
  
  // Additional property flags
  const flagsInfo = `
    Inherited: ${property.inherited ? 'Yes' : 'No'}
    Absentee Owner: ${property.absenteeOwner ? 'Yes' : 'No'}
    High Equity: ${property.highEquity ? 'Yes' : 'No'}
    Pre-Foreclosure: ${property.preForeclosure ? 'Yes' : 'No'}
    Free & Clear: ${property.freeClear ? 'Yes' : 'No'}
    Owner Occupied: ${property.ownerOccupied ? 'Yes' : 'No'}
    Vacant: ${property.vacant ? 'Yes' : 'No'}
  `;
  
  // Create a comprehensive context
  return `
    PROPERTY OVERVIEW:
    =================
    Full Address: ${address}, ${city}, ${state} ${zip}
    County: ${county}
    Property Type: ${propertyType}
    Bedrooms: ${bedrooms}
    Bathrooms: ${bathrooms}
    Square Feet: ${squareFeet}
    Year Built: ${yearBuilt}
    Lot Size: ${lotSize}
    Zoning: ${zoning}
    
    FINANCIAL DETAILS:
    =================
    Current Estimated Value: $${estimatedValue}
    Last Sale Price: $${lastSalePrice}
    Last Sale Date: ${lastSaleDate}
    Open Loan Balance: $${openLoanBalance}
    Estimated Equity: $${estimatedEquity} (${equityPercent}%)
    Property Tax: $${taxAmount}/year
    Assessed Value: $${assessedValue}
    
    RENTAL POTENTIAL:
    =================
    ${rentInfo}
    
    OWNER INFORMATION:
    =================
    Owner Name: ${ownerName}
    
    PROPERTY STATUS:
    =================
    ${flagsInfo}
    
    MORTGAGE DETAILS:
    =================
    ${mortgageDetails}
    
    TRANSACTION HISTORY:
    =================
    ${transactionHistory}
    
    COMPARABLE PROPERTIES (ARV ANALYSIS):
    =================
    ${compsInfo}
    
    PROPERTY DESCRIPTION:
    =================
    ${description}
  `;
}