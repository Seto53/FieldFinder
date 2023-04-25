import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {Router} from 'react-router-dom';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import React from "react";

describe('ResponsiveAppBar', () => {
    const onSportChange = jest.fn();

    beforeEach(() => {
        localStorage.setItem('loggedInUser', 'user123');
    });

    afterEach(() => {
        localStorage.removeItem('loggedInUser');
    });

    it('should render the app bar with the correct logo and title', () => {
        render(
            <Router location={""} navigator={""}>
                <ResponsiveAppBar onSportChange={onSportChange}/>
            </Router>
        );
        waitFor(() => expect(screen.getAllByText(/fieldfinder/i)).toBeInTheDocument())
    });

    it('should render the sport menu correctly', () => {
        render(
            <Router location={""} navigator={""}>
                <ResponsiveAppBar onSportChange={onSportChange}/>
            </Router>
        );
        fireEvent.click(screen.getByLabelText(/account of current user/i));
        expect(screen.getByRole('menu')).toBeInTheDocument();
        expect(screen.getAllByRole('menuitem')).toHaveLength(4);
        expect(screen.getByRole('menuitem', {name: /football/i})).toBeInTheDocument();
        expect(screen.getByRole('menuitem', {name: /basketball/i})).toBeInTheDocument();
        expect(screen.getByRole('menuitem', {name: /baseball/i})).toBeInTheDocument();
        expect(screen.getByRole('menuitem', {name: /tennis/i})).toBeInTheDocument();
    });

    it('should call onSportChange when a sport is selected from the menu', () => {
        render(
            <Router location={""} navigator={""}>
                <ResponsiveAppBar onSportChange={onSportChange}/>
            </Router>
        );
        fireEvent.click(screen.getByLabelText(/account of current user/i));
        fireEvent.click(screen.getByRole('menuitem', {name: /basketball/i}));
        expect(onSportChange).toHaveBeenCalledWith('Basketball');
    });
});
