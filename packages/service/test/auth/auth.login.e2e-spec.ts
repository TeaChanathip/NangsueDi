import { isValidObjectId } from 'mongoose';
import * as request from 'supertest';
import { isUnix } from '../../src/common/validators/isUnix.validator';
import { INestApplication } from '@nestjs/common';

describe('POST /auth/login', () => {
    let app: INestApplication = globalThis.app;

    afterEach(async () => {
        return new Promise((resolve) => setTimeout(resolve, 260));
    });

    it('should login successfully', async () => {
        const { body } = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'admin@admin.com',
                password: '111111',
            })
            .expect(201);

        expect(isValidObjectId(body._id)).toBe(true);
        expect(body.email).toEqual('pranee_sasithorn@gmail.com');
        expect(body.phone).toEqual('0611111111');
        expect(body.firstName).toEqual('Pranee');
        expect(body.lastName).toEqual('Sasithorn');
        expect(body.birthTime).toEqual(647036798);
        expect(body.role).toEqual('USER');
        expect(isUnix(body.registeredAt)).toBe(true);
    });

    it('should return UNAUTHORIZED (incorrect email)', async () => {
        return await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'admi@admin.com',
                password: '111111',
            })
            .expect(201);
    });

    it('should return UNAUTHORIZED (incorrect password)', async () => {
        return await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'admin@admin.com',
                password: '222222',
            })
            .expect(201);
    });

    it('should return BAD_REQUEST (empty email and password)', async () => {
        const { body } = await request(app.getHttpServer())
            .post('/auth/login')
            .send({})
            .expect(201);

        expect(body.message).toContain('email should not be empty');
        expect(body.message).toContain('password should not be empty');
    });
});
