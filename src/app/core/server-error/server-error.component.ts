import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss'
})
export class ServerErrorComponent {
  error: any

  constructor(private router: Router){
    const navigation = router.getCurrentNavigation()
    this.error = navigation && navigation.extras && navigation.extras.state && navigation.extras.state['error']
  }


}
