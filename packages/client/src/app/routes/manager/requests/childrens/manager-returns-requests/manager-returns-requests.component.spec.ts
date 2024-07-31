import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerReturnsRequestsComponent } from './manager-returns-requests.component';

describe('ManagerReturnsRequestsComponent', () => {
	let component: ManagerReturnsRequestsComponent;
	let fixture: ComponentFixture<ManagerReturnsRequestsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ManagerReturnsRequestsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ManagerReturnsRequestsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
