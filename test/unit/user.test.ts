import * as assert from "assert";
import { validate } from 'uuid';

import { User } from "../../src/domain/user";

describe('Unit test User', () => {

    const validEmail = 'test@test.com';
    const validFirstName = "Jim";
    const validLastName = "Petrosian";
    const validBirthdate = new Date("1985-09-08");
    const validAge = 38;

    const validUserDto = {
        email: validEmail,
        firstname: validFirstName,
        lastname: validLastName,
        birthdate: validBirthdate
    };

    describe('User.Register', () => {
        it('generates user when all properties are valid', () => {
            const user = User.register(validUserDto);
            assert.equal(user.firstname, validFirstName);
            assert.equal(user.lastname, validLastName);
            assert.equal(user.birthdate, validBirthdate);
        });

        it('generates user age from birthdate', () => {
            const user = User.register(validUserDto);
            assert.equal(user.age, validAge);
        });
        it('generates valid uuid when no ID is provided', () => {
            const user = User.register(validUserDto);
            assert.ok(validate(user.id));
        });
    })
});

