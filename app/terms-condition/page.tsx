import React from 'react'
import Header from '../components/layout/Header'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/layout/Footer'

const TermsConditionPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Terms & Conditions
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            By using the Celiac Store website (&ldquo;Website&rdquo;), you agree to comply with and be bound by these Terms and Conditions. If you do not agree with these Terms and Conditions, please do not use this Website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            2. Changes to Terms
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Celiac Store reserves the right to update, change, or replace any part of these Terms and Conditions at any time. It is your responsibility to check this page periodically for changes. Your continued use of the Website following the posting of any changes constitutes acceptance of those changes.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            3. Privacy Policy
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Your use of this Website is also governed by our Privacy Policy, which can be found at{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
              https://theceliacstore.com/privacy-policy/
            </a>
            . Please review our Privacy Policy to understand our practices.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            4. Use of Website
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            You agree to use the Website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else&apos;s use and enjoyment of the Website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            5. Intellectual Property
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            The content on this Website, including but not limited to text, graphics, logos, images, audio, and video materials, is the property of Celiac Store or its content suppliers and is protected by copyright laws. You may not use or reproduce any of the content without the express written consent of Celiac Store.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            6. Product Information
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Celiac Store strives to provide accurate and up-to-date information about its products. However, we do not guarantee the accuracy, completeness, or timeliness of product information on the Website. Product prices and availability are subject to change without notice.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            7. User Accounts
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            If you create an account on the Website, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            8. Limitation of Liability
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Celiac Store shall not be liable for any direct, indirect, incidental, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses, arising out of or in connection with your use of the Website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            9. Governing Law
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            These Terms and Conditions are governed by and construed in accordance with the laws of India, and any disputes arising under or in connection with these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts in Delhi, India.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            10. Contact Information
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            If you have any questions or concerns regarding these Terms and Conditions, please contact us at{' '}
            <a href="mailto:theceliacstore@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
              theceliacstore@gmail.com
            </a>
            .
          </p>

          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
            <p className="text-gray-700 leading-relaxed">
              If you have questions or concerns regarding these Terms and Conditions, please contact us at{' '}
              <a href="mailto:theceliacstore@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
                theceliacstore@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default TermsConditionPage
