type SslcommerzSessionInput = {
  origin: string;
  orderId: string;
  merchantTransactionId: string;
  paymentAttemptId: string;
  amount: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    district: string;
    area: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
  };
  itemNames: string[];
  itemCount: number;
};

type SslcommerzSessionResponse = {
  status?: string;
  failedreason?: string;
  sessionkey?: string;
  GatewayPageURL?: string;
};

export type SslcommerzValidationResponse = {
  status?: string;
  tran_date?: string;
  tran_id?: string;
  val_id?: string;
  amount?: string;
  store_amount?: string;
  bank_tran_id?: string;
  card_type?: string;
  currency?: string;
  currency_type?: string;
  value_a?: string;
  value_b?: string;
  value_c?: string;
  value_d?: string;
  risk_level?: string;
  risk_title?: string;
  error?: string;
  APIConnect?: string;
};

function getSslcommerzBaseUrls() {
  const isSandbox = process.env.SSLCOMMERZ_SANDBOX !== "false";

  return {
    mode: isSandbox ? "sandbox" : "live",
    initUrl: isSandbox
      ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
      : "https://securepay.sslcommerz.com/gwprocess/v4/api.php",
    validationUrl: isSandbox
      ? "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
      : "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php",
  };
}

function getSslcommerzCredentials() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;

  if (!storeId || !storePassword) {
    throw new Error(
      "Missing SSLCOMMERZ credentials. Set SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD.",
    );
  }

  return { storeId, storePassword };
}

export function buildMerchantTransactionId(orderId: string) {
  return `BB${orderId.replaceAll("-", "").slice(0, 28)}`;
}

export async function createSslcommerzSession(input: SslcommerzSessionInput) {
  const { initUrl, mode } = getSslcommerzBaseUrls();
  const { storeId, storePassword } = getSslcommerzCredentials();
  const callbackBase = `${input.origin}/api/payments/sslcommerz/callback`;

  const form = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: input.amount.toFixed(2),
    currency: "BDT",
    tran_id: input.merchantTransactionId,
    product_category: "jewellery",
    product_name: input.itemNames.join(", ").slice(0, 255),
    product_profile: "physical-goods",
    success_url: `${callbackBase}/success`,
    fail_url: `${callbackBase}/fail`,
    cancel_url: `${callbackBase}/cancel`,
    ipn_url: `${input.origin}/api/payments/sslcommerz/ipn`,
    cus_name: input.customer.fullName,
    cus_email: input.customer.email,
    cus_add1: input.customer.addressLine1,
    cus_add2: input.customer.addressLine2 ?? input.customer.area,
    cus_city: input.customer.district,
    cus_state: input.customer.area,
    cus_postcode: input.customer.postalCode,
    cus_country: "Bangladesh",
    cus_phone: input.customer.phone,
    shipping_method: "YES",
    num_of_item: String(input.itemCount),
    ship_name: input.customer.fullName,
    ship_add1: input.customer.addressLine1,
    ship_add2: input.customer.addressLine2 ?? input.customer.area,
    ship_area: input.customer.area,
    ship_city: input.customer.district,
    ship_state: input.customer.area,
    ship_postcode: input.customer.postalCode,
    ship_country: "Bangladesh",
    value_a: input.orderId,
    value_b: input.paymentAttemptId,
  });

  const response = await fetch(initUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`SSLCOMMERZ session request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as SslcommerzSessionResponse;

  if (!data.GatewayPageURL) {
    throw new Error(data.failedreason || "SSLCOMMERZ did not return a gateway URL.");
  }

  return {
    mode,
    gatewayPageUrl: data.GatewayPageURL,
    sessionKey: data.sessionkey ?? null,
    raw: data,
  };
}

export async function validateSslcommerzPayment(valId: string) {
  const { validationUrl } = getSslcommerzBaseUrls();
  const { storeId, storePassword } = getSslcommerzCredentials();
  const query = new URLSearchParams({
    val_id: valId,
    store_id: storeId,
    store_passwd: storePassword,
    v: "1",
    format: "json",
  });

  const response = await fetch(`${validationUrl}?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`SSLCOMMERZ validation failed with status ${response.status}.`);
  }

  return (await response.json()) as SslcommerzValidationResponse;
}
