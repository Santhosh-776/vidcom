import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SubscriptionPageProps {
    setHasSubscription: (value: boolean) => void;
}

const subscriptionPlans = [
    {
        id: "basic",
        name: "Basic",
        price: "$9.99",
        period: "month",
        features: [
            "10 video call minutes per day",
            "Basic humanoid selection",
            "Standard video quality",
            "Email support",
        ],
    },
    {
        id: "pro",
        name: "Professional",
        price: "$24.99",
        period: "month",
        features: [
            "30 video call minutes per day",
            "Full humanoid selection",
            "HD video quality",
            "Priority email & chat support",
        ],
        popular: true,
    },
    {
        id: "premium",
        name: "Premium",
        price: "$49.99",
        period: "month",
        features: [
            "Unlimited video call minutes",
            "Premium humanoid selection",
            "4K video quality",
            "24/7 phone & priority support",
            "API access",
        ],
    },
];

export default function SubscriptionPage({
    setHasSubscription,
}: SubscriptionPageProps) {
    const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[1].id);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handleSubscribe = async () => {
        setIsProcessing(true);

        try {
            // In a real app, this would process payment
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setHasSubscription(true);
            navigate("/");
        } catch (error) {
            console.error("Subscription failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Choose Your Subscription Plan
                </h1>

                <p className="text-lg text-gray-700 mb-8">
                    Get access to exclusive video calls with our humanoids.
                    Select the plan that works best for you.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {subscriptionPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-lg border ${
                                selectedPlan === plan.id
                                    ? "border-primary-500 ring-2 ring-primary-500"
                                    : "border-gray-300"
                            } bg-white p-6 shadow-sm`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 -mt-3 -mr-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                        Popular
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {plan.name}
                                </h3>
                                <input
                                    type="radio"
                                    id={plan.id}
                                    name="subscription_plan"
                                    checked={selectedPlan === plan.id}
                                    onChange={() => setSelectedPlan(plan.id)}
                                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300"
                                />
                            </div>

                            <div className="mb-4">
                                <span className="text-2xl font-bold text-gray-900">
                                    {plan.price}
                                </span>
                                <span className="text-gray-500">
                                    /{plan.period}
                                </span>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start">
                                        <svg
                                            className="h-5 w-5 text-green-500 mr-2"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <label
                                htmlFor={plan.id}
                                className={`block w-full text-center py-2 px-4 rounded-md ${
                                    selectedPlan === plan.id
                                        ? "bg-primary-600 text-white hover:bg-primary-700"
                                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                } cursor-pointer`}>
                                {selectedPlan === plan.id
                                    ? "Selected"
                                    : "Select"}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Payment Details
                    </h3>

                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="card-name"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Name on card
                            </label>
                            <input
                                type="text"
                                id="card-name"
                                className="input"
                                placeholder="John Smith"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="card-number"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Card number
                            </label>
                            <input
                                type="text"
                                id="card-number"
                                className="input"
                                placeholder="4242 4242 4242 4242"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-2">
                            <label
                                htmlFor="expiration-date"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Expiration date
                            </label>
                            <input
                                type="text"
                                id="expiration-date"
                                className="input"
                                placeholder="MM/YY"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-1">
                            <label
                                htmlFor="cvc"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                CVC
                            </label>
                            <input
                                type="text"
                                id="cvc"
                                className="input"
                                placeholder="123"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="zip-code"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP / Postal code
                            </label>
                            <input
                                type="text"
                                id="zip-code"
                                className="input"
                                placeholder="12345"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubscribe}
                    disabled={isProcessing}
                    className="w-full btn-primary py-3 text-lg">
                    {isProcessing
                        ? "Processing..."
                        : `Subscribe Now • ${
                              subscriptionPlans.find(
                                  (p) => p.id === selectedPlan
                              )?.price
                          }/month`}
                </button>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    By subscribing, you agree to our Terms of Service and
                    Privacy Policy.
                </p>
            </div>
        </div>
    );
}
