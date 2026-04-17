import { render, screen, fireEvent, cleanup} from '@testing-library/react';
import {expect, test, vi, afterEach, describe, it} from 'vitest';
import '@testing-library/jest-dom/vitest';
import DisclaimerBanner from './DisclaimerBanner';


describe('DisclaimerBanner', () =>{
    it('default disclaimer banner renders correctly', () =>{
        render(<DisclaimerBanner/>);
        const defaultText = screen.getByText(/This is general guidance, not medical advice. Consult a professional before starting new exercise or making dietary changes./);
        expect(defaultText).toBeInTheDocument();
    });

    it('compact disclaimer banner renders correctly', () =>{
        render(<DisclaimerBanner compact = {true}/>);
        const compactText = screen.getByText(/This is not medical advice./)
        expect(compactText).toBeInTheDocument();
    });

});