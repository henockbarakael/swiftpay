export class Request {
    merchantId: string;
    phone_number: string;
    amount: number;
    currency: string;
    service: string;
    reference: string;
    action: string;

    toString(){
        return JSON.stringify({
            merchantId:this.merchantId ,
            phone_number:this.phone_number ,
            amount:this.amount ,
            currency:this.currency ,
            service:this.service ,
            reference:this.reference ,
            action:this.action ,
        })
    }
}