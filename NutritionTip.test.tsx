import { render, screen, fireEvent, cleanup} from '@testing-library/react';
import {expect, test, vi, afterEach, describe, it} from 'vitest';
import '@testing-library/jest-dom/vitest';
import NutritionTip from './NutritionTip';

describe('NutritionTip', () => {
    it('nutrition tip renders correctly', () =>{
        render(<NutritionTip tip = "Test Tip"/>)
        const tipText = screen.getByText(/Test Tip/)
        expect(tipText).toBeInTheDocument();
    });
})