import { UserRes } from 'src/common/mongodb/usersdb/interfaces/user.res.interface';
import { UserFiltered } from '../interfaces/user.filtered.res.interface';
import { UserPermsRes } from 'src/common/mongodb/usersdb/interfaces/user-permissions.res.interface';

export function filterUserRes(
    user: UserRes | null,
    userPerms?: UserPermsRes,
): UserFiltered {
    if (!user) {
        return null;
    }

    // filter out the "password" and "tokenVersion"
    const userFiltered: UserFiltered = {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        avartarUrl: user.avartarUrl,
        role: user.role,
        registeredAt: user.registeredAt,
        ...(user.updatedAt && { updatedAt: user.updatedAt }),
        ...(user.suspendedAt && { suspendedAt: user.suspendedAt }),
    };

    // user permissions not passed into the function
    if (!userPerms) {
        return userFiltered;
    }
    return {
        ...userFiltered,
        permissions: {
            canBorrow: userPerms.canBorrow,
            canReview: userPerms.canReview,
        },
    };
}
