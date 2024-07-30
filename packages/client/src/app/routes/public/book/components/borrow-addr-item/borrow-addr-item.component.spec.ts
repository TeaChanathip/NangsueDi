import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowAddrItemComponent } from './borrow-addr-item.component';

describe('BorrowAddrItemComponent', () => {
	let component: BorrowAddrItemComponent;
	let fixture: ComponentFixture<BorrowAddrItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BorrowAddrItemComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BorrowAddrItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
