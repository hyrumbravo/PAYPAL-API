import { Component } from '@angular/core';
import { PaypalButtonComponent } from './paypal-button/paypal-button.component';

@Component({
  selector: 'app-root',
  imports: [PaypalButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'paypal-frontend';
}
