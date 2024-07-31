import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../../apis/admin/admin.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
	usersNum: number | null = null;
	booksNum: number | null = null;
	borrowsNum: number | null = null;
	returnsNum: number | null = null;

	destroy$ = new Subject<void>();

	constructor(private adminService: AdminService) {}

	ngOnInit(): void {
		this.adminService
			.getNumberOfUsers()
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(value: HttpResponse<number>) => (this.usersNum = value.body),
			);

		this.adminService
			.getNumberOfBooks()
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(value: HttpResponse<number>) => (this.booksNum = value.body),
			);

		this.adminService
			.getNumberOfBorrows()
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(value: HttpResponse<number>) => (this.borrowsNum = value.body),
			);

		this.adminService
			.getNumberOfReturns()
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(value: HttpResponse<number>) => (this.returnsNum = value.body),
			);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
