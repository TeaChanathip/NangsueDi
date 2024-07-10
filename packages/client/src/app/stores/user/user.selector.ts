import { createFeatureSelector, createSelector } from '@ngrx/store';
import { User } from '../../shared/interfaces/user.model';

export const selectCars = createFeatureSelector<User[]>('user');
