import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { isValidObjectId } from 'mongoose';
import { isUnix } from '../../src/common/validators/isUnix.validator';

describe('GET /auth/register', () => {
    let app: INestApplication = globalThis.app;

    afterEach(async () => {
        return new Promise((resolve) => setTimeout(resolve, 260));
    });

    // afterAll(async () => {
    //     const conn = await mongoose.connect(process.env.MONGODB_URI);
    //     conn.connection.db.dropDatabase();
    // });

    it('should create a new user', async () => {
        const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: '    pranee_sasithorn@gmail.com    ',
                phone: '0611111111',
                password: '111111',
                firstName: '    Pranee    ',
                lastName: '    Sasithorn    ',
                birthTime: 647036798,
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

    it('should return BAD_REQUEST (The email is already taken)', async () => {
        return await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'pranee_sasithorn@gmail.com',
                phone: '0622222222',
                password: '222222',
                firstName: 'Pranee',
                lastName: 'Sasithorn',
                birthTime: 647036798,
            })
            .expect(400);
    });

    it('should return BAD_REQUEST (Invalid email and phone format)', async () => {
        const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'pranee_sasithorngmail.com',
                phone: '+66 22222222',
                password: '222222',
                firstName: 'Pranee',
                lastName: 'Sasithorn',
                birthTime: 647036798,
            })
            .expect(400);

        expect(body.message).toContain('email must be an email');
        expect(body.message).toContain('Phone number format is incorrect');
    });

    it('should return BAD_REQUEST (password is too short, firstName is too long, lastName is too long, birthDate is not unix)', async () => {
        const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'sasithorn_lalita@gmail.com',
                phone: '0622222222',
                password: '22222',
                firstName:
                    'SasithornSasithornSasithornSasithornSasithornSasithornSasithornSasithornSasithornSasithornSasithornSasithorn',
                lastName:
                    'LalitaLalitaLalitaLalitaLalitaLalitaLalitaLalitaLalitaLalitaLalitaLalitaLalitaLalitaLalitaLalitaLalitaLalita',
                birthTime: 13408164000,
            })
            .expect(400);

        expect(body.message).toContain(
            'password must be longer than or equal to 6 characters',
        );
        expect(body.message).toContain(
            'firstName must be shorter than or equal to 100 characters',
        );
        expect(body.message).toContain(
            'lastName must be shorter than or equal to 100 characters',
        );
        expect(body.message).toContain('Invalid Unix timestamp');
    });

    it('should return BAD_REQUEST (password is too long, age is less than 12)', async () => {
        const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'sasithorn_lalita@gmail.com',
                phone: '0622222222',
                password:
                    '22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222',
                firstName: 'Sasithorn',
                lastName: 'Lalita',
                birthTime: 1349309565,
            })
            .expect(400);

        expect(body.message).toContain(
            'password must be shorter than or equal to 100 characters',
        );
        expect(body.message).toContain('The age must be at least 12 years');
    });

    it('should return BAD_REQUEST (empty fields)', async () => {
        const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send({})
            .expect(400);

        expect(body.message).toContain('email should not be empty');
        expect(body.message).toContain('phone should not be empty');
        expect(body.message).toContain('password should not be empty');
        expect(body.message).toContain('firstName should not be empty');
        expect(body.message).not.toContain('lastName should not be empty');
        expect(body.message).toContain('birthTime should not be empty');
    });
});
