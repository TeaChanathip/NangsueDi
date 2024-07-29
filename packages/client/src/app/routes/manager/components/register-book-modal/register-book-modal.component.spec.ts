import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBookModalComponent } from './register-book-modal.component';

describe('RegisterBookModalComponent', () => {
	let component: RegisterBookModalComponent;
	let fixture: ComponentFixture<RegisterBookModalComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RegisterBookModalComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(RegisterBookModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
