import * as request from 'supertest';
import { isUnix } from '../../src/common/validators/isUnix.validator';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { isValidObjectId } from 'mongoose';
import { isJWT } from 'class-validator';

describe('POST /auth/login', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );
        await app.init();
    });

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

        const { accessToken, user } = body;

        expect(isJWT(accessToken)).toBe(true);
        expect(isValidObjectId(user._id)).toBe(true);
        expect(user.email).toEqual('admin@admin.com');
        expect(user.phone).toEqual('0611111111');
        expect(user.firstName).toEqual('admin');
        expect(user.lastName).toEqual('admin');
        expect(user.birthTime).toEqual(647036798);
        expect(user.role).toEqual('USER');
        expect(isUnix(user.registeredAt)).toBe(true);
    });

    it('should return UNAUTHORIZED (incorrect email)', async () => {
        return await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'admi@admin.com',
                password: '111111',
            })
            .expect(401);
    });

    it('should return UNAUTHORIZED (incorrect password)', async () => {
        return await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'admin@admin.com',
                password: '222222',
            })
            .expect(401);
    });

    it('should return BAD_REQUEST (empty email and password)', async () => {
        const { body } = await request(app.getHttpServer())
            .post('/auth/login')
            .send({})
            .expect(401);

        expect(body.message).toContain('email should not be empty');
        expect(body.message).toContain('password should not be empty');
    });
});
