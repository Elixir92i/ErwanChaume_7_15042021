import { Component } from '@angular/core';
import { AuthGuard } from './services/auth-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Groupomania';

  constructor(
    public AuthGuard: AuthGuard) { }

    onLogout(){
      localStorage.clear();
      window.location.reload();
    }
}
