import React from "react";
import StaticPageLayout from "../components/StaticPageLayout";

const PrivacyPolicy = () => {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p className="mb-4">Last Updated: March 3, 2026</p>
      <p className="mb-4">
        At Assessflow, we take your privacy seriously. This Privacy Policy
        explains how we collect, use, and protect your personal information when
        you use our platform.
      </p>
      <h2
        className="text-2xl font-semibold mt-8 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Information We Collect
      </h2>
      <p className="mb-4">
        We collect information that you provide to us directly, such as when you
        create an account, as well as information collected automatically
        through your use of the platform.
      </p>
      <h3
        className="text-xl font-bold mt-6 mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        Personal Information
      </h3>
      <p className="mb-4">
        This includes your name, email address, company details, and any
        candidate information you upload to the platform.
      </p>
      <h2
        className="text-2xl font-semibold mt-8 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        How We Use Your Information
      </h2>
      <p className="mb-4">
        We use the information we collect to provide, maintain, and improve our
        services, communicate with you, and ensure the security of the platform.
      </p>
      <h2
        className="text-2xl font-semibold mt-8 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Data Security
      </h2>
      <p className="mb-4">
        We implement industry-standard security measures to protect your data
        from unauthorized access, disclosure, or destruction.
      </p>
    </StaticPageLayout>
  );
};

export default PrivacyPolicy;
