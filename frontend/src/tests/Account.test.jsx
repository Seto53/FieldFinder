import {render} from '@testing-library/react';
import {Router} from 'react-router-dom';
import Account from '../components/Account';
import React from "react";

describe('Account', () => {
    const onSportChange = jest.fn();

    beforeEach(() => {
        localStorage.setItem('loggedInUser', 'user123');
    });

    afterEach(() => {
        localStorage.removeItem('loggedInUser');
    });

    test('renders Account component without crashing', () => {
        render(
            <Router location={""} navigator={""}>
                <Account/>
            </Router>
        );
    });
});
