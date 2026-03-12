import { render, screen, fireEvent, cleanup} from '@testing-library/react';
import {expect, test, vi, afterEach} from 'vitest';
import '@testing-library/jest-dom/vitest';
import MoodSlider from "./MoodSlider";

const defaultMoodsliderProps = {
    label: "Mood",
    value: 3,
    onChange: () => {},
    lowEmoji: ":(",
    highEmoji: ":)",
    lowLabel: "low",
    highLabel: "high"
};

const mockOnChange = vi.fn();

afterEach(cleanup);

test('renders the slider with labels', () =>{
    render(<MoodSlider {...defaultMoodsliderProps} />);
    //Checking everything is loading correctly
    expect(screen.getByText("Mood")).toBeInTheDocument();
    expect(screen.getByText(":(")).toBeInTheDocument();
    expect(screen.getByText(":)")).toBeInTheDocument();

    //checking if slider works
    expect(screen.getByRole('slider', {name:"Mood"})).toHaveValue("3")
})
test('slider value changes', () => {
    render(<MoodSlider {...defaultMoodsliderProps} onChange={mockOnChange}/>);

    fireEvent.change(screen.getByRole('slider', {name: "Mood"}), {target: {value : '4'}});
    expect(mockOnChange).toHaveBeenCalledWith(4)
})