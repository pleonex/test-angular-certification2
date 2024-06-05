import {Component} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, RouterLink]
})
export class AppComponent {
  appName = 'Tesla configurator'
  author = 'Benito Palacios Sanchez (@pleonex)';
  repoUrl = 'https://github.com/pleonex/test-angular-certification2';
}
