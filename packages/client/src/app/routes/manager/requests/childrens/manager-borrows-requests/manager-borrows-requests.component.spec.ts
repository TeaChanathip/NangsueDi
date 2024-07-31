import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerBorrowsRequestsComponent } from './manager-borrows-requests.component';

describe('ManagerBorrowsRequestsComponent', () => {
	let component: ManagerBorrowsRequestsComponent;
	let fixture: ComponentFixture<ManagerBorrowsRequestsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ManagerBorrowsRequestsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ManagerBorrowsRequestsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
