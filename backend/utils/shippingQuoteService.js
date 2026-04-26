/**
 * Shipping quote service
 * Supports Australia Post PAC when keys are available, with safe fallback.
 */

const parseAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
};

const buildFallbackQuote = ({ subtotal }) => {
  const safeSubtotal = Number(subtotal) || 0;
  const amount = safeSubtotal > 100 ? 0 : 10;
  return {
    amount,
    service: "Standard Shipping",
    source: "fallback",
    estimated_days: "3-5 business days",
  };
};

const buildPacUrl = ({ destinationPostcode }) => {
  const endpoint =
    process.env.AUSPOST_PAC_BASE_URL ||
    "https://digitalapi.auspost.com.au/postage/parcel/domestic/calculate.json";
  const fromPostcode = process.env.AUSPOST_FROM_POSTCODE || "3000";
  const weight = process.env.AUSPOST_DEFAULT_WEIGHT || "1";
  const length = process.env.AUSPOST_DEFAULT_LENGTH || "22";
  const width = process.env.AUSPOST_DEFAULT_WIDTH || "16";
  const height = process.env.AUSPOST_DEFAULT_HEIGHT || "7";
  const serviceCode = process.env.AUSPOST_SERVICE_CODE || "AUS_PARCEL_REGULAR";

  const url = new URL(endpoint);
  url.searchParams.set("from_postcode", fromPostcode);
  url.searchParams.set("to_postcode", destinationPostcode);
  url.searchParams.set("weight", weight);
  url.searchParams.set("length", length);
  url.searchParams.set("width", width);
  url.searchParams.set("height", height);
  url.searchParams.set("service_code", serviceCode);
  return url.toString();
};

const parsePacResponse = (data) => {
  const nestedAmount =
    parseAmount(data?.postage_result?.total_cost) ??
    parseAmount(data?.postage_result?.costs?.[0]?.cost) ??
    parseAmount(data?.total_cost) ??
    parseAmount(data?.price) ??
    null;

  if (nestedAmount === null) {
    return null;
  }

  return {
    amount: nestedAmount,
    service: data?.postage_result?.service || "Australia Post",
    source: "auspost_pac",
    estimated_days: data?.postage_result?.delivery_time || "Estimated by Australia Post",
  };
};

export const getShippingQuote = async ({
  subtotal,
  destinationPostcode,
  destinationCountry,
}) => {
  const safePostcode = String(destinationPostcode || "").trim();
  const safeCountry = String(destinationCountry || "").trim().toLowerCase();
  const fallback = buildFallbackQuote({ subtotal });

  if (!safePostcode || (safeCountry && safeCountry !== "australia")) {
    return fallback;
  }

  const apiKey = process.env.AUSPOST_PAC_API_KEY;
  if (!apiKey) {
    return fallback;
  }

  try {
    const response = await fetch(buildPacUrl({ destinationPostcode: safePostcode }), {
      headers: {
        AUTH_KEY: apiKey,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();
    const pacQuote = parsePacResponse(data);
    return pacQuote || fallback;
  } catch (error) {
    return fallback;
  }
};

