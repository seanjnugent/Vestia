import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, MapPin, Mail, Shield, Check, TrendingUp } from "lucide-react";

const Register = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    street: "",
    city: "",
    postcode: "",
    country: "",
    email: "",
    phone: "",
    password: "",
    investmentExperience: "",
    investmentGoal: "",
    riskTolerance: "",
    acceptTerms: false,
  });

  const navigate = useNavigate();

  const investmentExperienceOptions = [
    { value: "Beginner", label: "Beginner - New to investing" },
    { value: "Intermediate", label: "Intermediate - Some market experience" },
    { value: "Advanced", label: "Advanced - Regular investor" },
    { value: "Expert", label: "Expert - Professional experience" }
  ];

  const investmentGoalOptions = [
    { value: "Growth", label: "Growth - Focus on long-term capital appreciation" },
    { value: "Income", label: "Income - Regular dividend payments" },
    { value: "Preservation", label: "Preservation - Protect existing wealth" },
    { value: "Speculation", label: "Speculation - High-risk, high-reward opportunities" }
  ];

  const riskToleranceOptions = [
    { value: "Low", label: "Low - Prefer stability, uncomfortable with any losses" },
    { value: "Medium", label: "Medium - Can tolerate moderate market fluctuations up to 30%" },
    { value: "High", label: "High - Comfortable with significant volatility, can handle 80% drops" }
  ];

  const sections = [
    {
      title: "Personal Information",
      icon: <User />,
      fields: ["firstName", "lastName", "dateOfBirth"],
    },
    {
      title: "Address Details",
      icon: <MapPin />,
      fields: ["street", "city", "postcode", "country"],
    },
    {
      title: "Contact Information",
      icon: <Mail />,
      fields: ["email", "phone"],
    },
    {
      title: "Investment Profile",
      icon: <TrendingUp />,
      fields: ["investmentExperience", "investmentGoal", "riskTolerance"],
    },
    {
      title: "Security Settings",
      icon: <Shield />,
      fields: ["password", "acceptTerms"],
    },
  ];

  const renderField = (field) => {
    if (field === "acceptTerms") {
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={field}
            checked={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor={field}>I accept the terms and conditions</label>
        </div>
      );
    }

    if (field === "dateOfBirth") {
      return (
        <input
          type="date"
          value={formData[field]}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors duration-300"
        />
      );
    }

    if (["investmentExperience", "investmentGoal", "riskTolerance"].includes(field)) {
      const options = {
        investmentExperience: investmentExperienceOptions,
        investmentGoal: investmentGoalOptions,
        riskTolerance: riskToleranceOptions
      }[field];

      return (
        <div className="space-y-2">
          <select
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors duration-300"
          >
            <option value="">Select an option</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 italic">
            {options.find(opt => opt.value === formData[field])?.label.split(" - ")[1] || ""}
          </p>
        </div>
      );
    }

    return (
      <input
        type={field === "password" ? "password" : "text"}
        value={formData[field]}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors duration-300"
      />
    );
  };

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleRegister = async () => {
    try {
      // First, log the request payload for debugging
      const payload = {
        firstName: formData.firstName,
        surname: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        residentialAddress: {
          street: formData.street,
          city: formData.city,
          postcode: formData.postcode,
          country: formData.country
        },
        clientProfile: {
          investmentExperience: formData.investmentExperience,
          investmentGoal: formData.investmentGoal,
          riskTolerance: formData.riskTolerance
        },
        emailAddress: formData.email,
        phoneNumber: formData.phone,
      };

      console.log('Sending payload:', payload);

      const response = await fetch("http://localhost:5000/api/clients/postNewClient", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Add CORS headers if needed
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Server returned invalid JSON. Response: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed!');
      }

      // If we get here, registration was successful
      localStorage.setItem("token", "12345");
      localStorage.setItem("userId", data.clientId);
      navigate("/home");
    } catch (err) {
      console.error("Error during registration:", err);
      alert(`Registration failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with animated gradient - Hidden on small screens */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <style jsx>{`
          @keyframes gradientBg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animated-gradient {
            background: linear-gradient(
              -45deg,
              #ff7e5f, #feb47b, #7c3aed, #2dd4bf,
              #34d399, #60a5fa, #f43f5e, #a78bfa
            );
            background-size: 800% 800%;
            animation: gradientBg 30s ease infinite;
          }

          .diagonal-fade {
            background: linear-gradient(
              135deg,
              transparent 0%,
              rgba(255, 255, 255, 0.1) 100%
            );
            backdrop-filter: blur(10px);
          }
        `}</style>

        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute inset-0 diagonal-fade" />

        <div className="relative h-full flex flex-col justify-center p-16">
          <div className="backdrop-blur-lg bg-white/10 p-8 rounded-3xl border border-white/20">
            <h1 className="text-7xl font-bold mb-6 text-white">
              Create your account
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Start investing in stocks, funds and cryptocurrencies with Vestia's powerful platform.
            </p>
          </div>
        </div>
      </div>

      {/* Right side with form - Full width on small screens */}
      <div className="w-full lg:w-1/2 bg-gray-50 overflow-y-auto">
        {/* Progress bar */}
        <div className="fixed top-0 left-0 lg:left-1/2 right-0 h-2 bg-gray-200">
          <div 
            className="h-full bg-purple-600 transition-all duration-500"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          />
        </div>

        <div className="max-w-xl mx-auto py-12 px-8">
          <div className="mb-12">
            <div className="flex justify-between items-center">
              <img src="/vestia-client.svg" alt="Vestia Logo" className="h-10" />
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
              >
                Already have an account?
              </button>
            </div>
          </div>

          {sections.map((section, index) => (
            <div
              key={section.title}
              className={`transition-all duration-700 ${
                index === currentSection
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-8 absolute"
              }`}
            >
              {index === currentSection && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {section.title}
                      </h2>
                      <p className="text-gray-500">
                        Step {index + 1} of {sections.length}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {section.fields.map((field) => (
                      <div key={field} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .split(" ")
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center mt-8">
                    {index < sections.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNextSection}
                        className="group flex items-center space-x-2 px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300"
                      >
                        <span>Continue</span>
                        <ChevronDown className="w-5 h-5 group-hover:transform group-hover:translate-y-1 transition-transform duration-300" />
                      </button>
                    ) : (
                      <button
                        onClick={handleRegister}
                        className="flex items-center space-x-2 px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300"
                      >
                        <span>Complete Registration</span>
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;