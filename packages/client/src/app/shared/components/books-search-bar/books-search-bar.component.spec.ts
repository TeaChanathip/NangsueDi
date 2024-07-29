import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksSearchBarComponent } from './books-search-bar.component';

describe('SearchBarComponent', () => {
	let component: BooksSearchBarComponent;
	let fixture: ComponentFixture<BooksSearchBarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BooksSearchBarComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BooksSearchBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
