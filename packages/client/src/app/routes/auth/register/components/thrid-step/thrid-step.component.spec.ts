import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThridStepComponent } from './thrid-step.component';

describe('ThridStepComponent', () => {
	let component: ThridStepComponent;
	let fixture: ComponentFixture<ThridStepComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ThridStepComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ThridStepComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
