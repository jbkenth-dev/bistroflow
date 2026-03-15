import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CheckoutStepper } from "../../../components/ui/checkout-stepper";

const STEPS = [
  { id: 1, label: "Summary" },
  { id: 2, label: "Order Type" },
  { id: 3, label: "Payment" },
];

describe("CheckoutStepper", () => {
  it("renders all steps correctly", () => {
    render(<CheckoutStepper currentStep={1} steps={STEPS} />);
    
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("Order Type")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
  });

  it("marks the current step as active", () => {
    render(<CheckoutStepper currentStep={2} steps={STEPS} />);
    
    const step2Button = screen.getByLabelText(/Step 2: Order Type/i);
    expect(step2Button).toHaveAttribute("aria-current", "step");
  });

  it("marks completed steps correctly", () => {
    render(<CheckoutStepper currentStep={2} steps={STEPS} />);
    
    // Step 1 should be completed
    const step1Button = screen.getByLabelText(/Step 1: Summary, completed/i);
    expect(step1Button).toBeInTheDocument();
    // Should show check icon (we can verify by class or structure, but label is good enough for accessibility test)
  });

  it("calls onStepClick when a previous step is clicked", () => {
    const handleStepClick = jest.fn();
    render(<CheckoutStepper currentStep={2} steps={STEPS} onStepClick={handleStepClick} />);
    
    const step1Button = screen.getByRole("button", { name: /Step 1/i });
    fireEvent.click(step1Button);
    
    expect(handleStepClick).toHaveBeenCalledWith(1);
  });

  it("disables future steps", () => {
    const handleStepClick = jest.fn();
    render(<CheckoutStepper currentStep={1} steps={STEPS} onStepClick={handleStepClick} />);
    
    const step2Button = screen.getByRole("button", { name: /Step 2/i });
    expect(step2Button).toBeDisabled();
    
    fireEvent.click(step2Button);
    expect(handleStepClick).not.toHaveBeenCalled();
  });

  it("renders with correct accessibility attributes", () => {
    render(<CheckoutStepper currentStep={1} steps={STEPS} />);
    
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Checkout Progress");
  });
});
