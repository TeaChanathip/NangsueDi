import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateCheckBoxComponent } from './state-check-box.component';

describe('StateCheckBoxComponent', () => {
	let component: StateCheckBoxComponent;
	let fixture: ComponentFixture<StateCheckBoxComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [StateCheckBoxComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(StateCheckBoxComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
