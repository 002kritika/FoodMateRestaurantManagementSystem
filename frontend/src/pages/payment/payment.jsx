import { useEffect } from "react";

export default function Payment({ paymentData }) {
  if (!paymentData) return <div>Loading...</div>;

  const {
    amount,
    product_delivery_charge,
    total_amount,
    transaction_uuid,
    signature,
    success_url,
    failure_url,
  } = paymentData;

  useEffect(() => {
    document.getElementById("esewaForm").submit();
  }, []);

  return (
    <form
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
      id="esewaForm"
    >
      <input type="hidden" name="amount" value={paymentData.amount} />
      <input type="hidden" name="tax_amount" value="0" />
      <input type="hidden" name="product_service_charge" value="0" />
      <input
        type="hidden"
        name="product_delivery_charge"
        value={paymentData.product_delivery_charge}
      />
      <input
        type="hidden"
        name="total_amount"
        value={paymentData.total_amount}
      />
      <input
        type="hidden"
        name="transaction_uuid"
        value={paymentData.transaction_uuid}
      />
      <input type="hidden" name="product_code" value="EPAYTEST" />
      <input type="hidden" name="success_url" value={paymentData.success_url} />
      <input type="hidden" name="failure_url" value={paymentData.failure_url} />
      <input
        type="hidden"
        name="signed_field_names"
        value="total_amount,transaction_uuid,product_code"
      />
      <input type="hidden" name="signature" value={paymentData.signature} />
    </form>
  );
}
