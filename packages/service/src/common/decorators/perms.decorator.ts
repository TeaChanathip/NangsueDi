import { SetMetadata } from '@nestjs/common';
import { Perm } from 'src/shared/enums/perm.enum';

export const PERMS_KEY = 'perms';
export const Perms = (...perms: Perm[]) => SetMetadata(PERMS_KEY, perms);
