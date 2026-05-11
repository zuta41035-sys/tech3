import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="text-left p-10 bg-gray-100 rounded-xl max-w-3xl mx-auto shadow-lg mt-10">
        <h2 className="text-3xl font-bold mb-6 text-orange-600">Privacy Policy</h2>

        <p className="text-gray-700 mb-6 leading-relaxed">
          At Tech3 Stores, your privacy is our priority. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.
        </p>

        <h3 className="text-xl font-semibold mb-3">Information We Collect</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          We may collect personal information such as your name, email address, shipping and billing information, and payment details when you place an order or create an account.
        </p>

        <h3 className="text-xl font-semibold mb-3">How We Use Your Information</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Your information is used to process orders, communicate with you, improve our services, and comply with legal requirements. We do not sell or rent your personal data to third parties.
        </p>

        <h3 className="text-xl font-semibold mb-3">Data Security</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h3 className="text-xl font-semibold mb-3">Cookies</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Our website uses cookies to enhance your browsing experience and provide personalized services. You can disable cookies in your browser settings, but some features may not work properly.
        </p>

        <h3 className="text-xl font-semibold mb-3">Your Rights</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          You have the right to access, correct, or delete your personal information. Please contact us if you have any questions about your data.
        </p>

        <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          If you have any questions or concerns regarding this Privacy Policy, please contact us through our Contact Us page.
        </p>
      </div>
    </>
  );
};

export default PrivacyPolicy;
