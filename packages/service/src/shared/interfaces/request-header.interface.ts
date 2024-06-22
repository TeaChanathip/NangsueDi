import { JwtUserPayload } from './jwt-user.payload.interface';

export class RequestHeader extends Headers {
    user: JwtUserPayload;
}
