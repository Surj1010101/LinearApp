import { render, screen, fireEvent, cleanup} from '@testing-library/react';
import {expect, test, vi, afterEach, describe, it} from 'vitest';
import '@testing-library/jest-dom/vitest';
import ExerciseCard from './ExerciseCard';

const defaultRecommendation ={
    exerciseName: "Exercise",
    exerciseCategory: "category_1",
    exerciseDescription: "This is an exercise",
    durationMins: 10,
    intensity: "low"
} as any;

describe('ExerciseCard',()=>{
    it('components render recommendation correctly', () => {
        render(<ExerciseCard recommendation= {defaultRecommendation}/>);
        expect(screen.getByText("Exercise")).toBeInTheDocument();
        expect(screen.getByText("This is an exercise")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
    });
});