import { render, screen, fireEvent, cleanup} from '@testing-library/react';
import {expect, test, vi, afterEach, describe, it} from 'vitest';
import '@testing-library/jest-dom/vitest';
import MoodChart from './MoodChart';

vi.mock('recharts', async () => {
    const Actual = await vi.importActual('recharts');
    return {
        ...Actual,
        ResponsiveContainer: ({ children }: any) => <div data-testid="chart-container">{children}</div>,
    };
});

const mockData = [
    { date: '2026-05-01', value: 3 },
    { date: '2026-05-02', value: 4 }
] as any;

describe('MoodChart', () => {
    it('renders loading state', () => {
        render(<MoodChart data={[]} loading={true} />);
        expect(screen.getByText(/Loading chart.../i)).toBeInTheDocument();
    });

    it('renders the empty space when nothing passed in', () => {
        render(<MoodChart data={[]} loading={false} />);
        expect(screen.getByText(/No data yet/i)).toBeInTheDocument();
    });

    it('renders chart correctly', () => {
        render(<MoodChart data={mockData} loading={false} />);
        expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    });

    it('ensuring perirod change works as expected', () => {
        const mockOnPeriodChange = vi.fn();
        render(<MoodChart data={mockData} onPeriodChange={mockOnPeriodChange} />);

        const button14d = screen.getByRole('button', { name: 'Show 14 days' });
        fireEvent.click(button14d);
        expect(mockOnPeriodChange).toHaveBeenCalledWith(14, 'mood');
    });

    it('ensuring different metrics work correctly', () => {
        const mockOnPeriodChange = vi.fn();
        
        render(<MoodChart data={mockData} onPeriodChange={mockOnPeriodChange} />);
        
        const energyButton = screen.getByText(/Energy/i);
        fireEvent.click(energyButton);
        expect(mockOnPeriodChange).toHaveBeenCalledWith(7, 'energy');
    });

    it('active styles when a button is clicked', () => {
        render(<MoodChart data={mockData} />);
        
        const energyButton = screen.getByText(/Energy/i);
        fireEvent.click(energyButton);

        expect(energyButton).toHaveClass('mood-chart__metric-btn--active');
    });

});