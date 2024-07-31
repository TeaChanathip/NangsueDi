import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonReturnedComponent } from './non-returned.component';

describe('NonReturnedComponent', () => {
	let component: NonReturnedComponent;
	let fixture: ComponentFixture<NonReturnedComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NonReturnedComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NonReturnedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
