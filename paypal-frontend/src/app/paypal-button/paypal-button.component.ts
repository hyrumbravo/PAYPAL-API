import { Component, AfterViewInit } from '@angular/core';

declare global {
  interface Window {
    paypal: any;
  }
}

@Component({
  selector: 'app-paypal-button',
  standalone: true,
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css']
})
export class PaypalButtonComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.loadPayPalScript();
  }

  private loadPayPalScript() {
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=AS0DPgkh0ZENMcSpe8dK5b9ztKMvZFDVgJHDwyYQ3_wsRhE9Dnmc2SVSmdpMbAwYhFD934Q8z8hxX1Tw&currency=USD";
    script.onload = this.initializePayPalButton;
    document.body.appendChild(script);
  }

  private initializePayPalButton() {
    window.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: '10.00' // Modify based on your payment
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert('Transaction completed by ' + details.payer.name.given_name);
        });
      }
    }).render('#paypal-button-container');  // Attach the button to the container
  }
}
