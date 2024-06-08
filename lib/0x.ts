import axios from "axios";

type PriceQueryParams = {
  sellToken?: string;
  buyToken?: string;
  sellAmount?: any;
  buyAmount?: any;
  takerAddress?: string;
  feeRecipient?: string;
  buyTokenPercentageFee?: number;
};

interface SwapQuoteParams {
  sellToken: `0x${string}` | undefined;
  buyToken: `0x${string}` | undefined;
  sellAmount?: any;
  buyAmount?: any;
  takerAddress?: string;
  slippagePercentage?: string;
}
const API_KEY = process.env.NEXT_PUBLIC_0x_API_KEY;

export async function fetchPrice(queryParams: PriceQueryParams): Promise<any> {
  const query = new URLSearchParams(queryParams as any).toString();

  try {
    let URL = "https://polygon.api.0x.org/swap/v1/price";

    const response = await axios.get(`${URL}?${query}`, {
      headers: {
        "0x-api-key": API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching price:", error);
    throw error; // Rethrow or handle as needed
  }
}

export async function getSwapQuote(params: SwapQuoteParams): Promise<any> {
  const query = new URLSearchParams(params as any).toString();
  try {
    let URL = "https://polygon.api.0x.org/swap/v1/quote";
    const response = await axios.get(`${URL}?${query}`, {
      headers: {
        "0x-api-key": API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching swap quote:", error);
    throw error;
  }
}
