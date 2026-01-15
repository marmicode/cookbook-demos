import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {}
