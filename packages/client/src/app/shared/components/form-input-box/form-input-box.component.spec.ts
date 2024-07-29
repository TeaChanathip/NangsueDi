import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputBoxComponent } from './form-input-box.component';

describe('FormInputBoxComponent', () => {
	let component: FormInputBoxComponent;
	let fixture: ComponentFixture<FormInputBoxComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormInputBoxComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FormInputBoxComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
