import { render, screen, fireEvent, cleanup} from '@testing-library/react';
import {expect, test, vi, afterEach, describe, it} from 'vitest';
import '@testing-library/jest-dom/vitest';
import ConfidenceBadge from './ConfidenceBadge';

describe('ConfidentBadge', () =>{
    it('component rendered properly test', () => {
        render(<ConfidenceBadge confidence = {0.30} />);
        const percentageText = screen.getByText(/30%/);
        expect(percentageText).toBeInTheDocument();
    });
    
    it('renders red badge when confidence is below 50',() => {
        render(<ConfidenceBadge confidence={0.25}/>);
        //Check for style color
        const percentageText = screen.getByText(/25%/);
        //Excpect style color to be ef4444
        expect(percentageText).toHaveStyle({color: '#ef4444'});
    });

    it('renders orange badge when confidence is between 50 and 69',() =>{
        render(<ConfidenceBadge confidence={0.60} />);
        const percentageText = screen.getByText(/60%/);
        expect(percentageText).toHaveStyle({color: '#f59e0b'});
    });

    it('redners green badge when confidence is over 70',() =>{
        render(<ConfidenceBadge confidence={0.80}/>)
        const percentageText = screen.getByText(/80%/);
        expect(percentageText).toHaveStyle({color: '#22c55e'})
    })
})