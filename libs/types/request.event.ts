export class Request {
  merchantID: string;
  phoneNumber: string;
  amount: number;
  currency: string;
  service: string;
  reference: string;
  action: string;
  callbackUrl: string;

  toString() {
    return JSON.stringify({
      merchantId: this.merchantID,
      phone_number: this.phoneNumber,
      amount: this.amount,
      currency: this.currency,
      service: this.service,
      reference: this.reference,
      action: this.action,
      callback_url: this.callbackUrl,
    });
  }
}
