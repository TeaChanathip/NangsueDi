import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-menus-bar',
	standalone: true,
	imports: [RouterModule],
	templateUrl: './menus-bar.component.html',
	styleUrl: './menus-bar.component.scss',
})
export class MenusBarComponent {}
