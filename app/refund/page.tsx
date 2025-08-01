import React from 'react'
import Header from '../components/layout/Header'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/layout/Footer'

const RefundPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Refund and Returns Policy
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-6 leading-relaxed">
            Our refund and returns policy lasts 14 days. If 14 days have passed since your purchase, we can&apos;t offer you a full refund or exchange.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Return Eligibility
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Several types of goods are exempt from being returned. Perishable foods or items close to expiry cannot be returned.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Non-Returnable Items
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Additional non-returnable items:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>Gift cards</li>
            <li>Downloadable software products</li>
            <li>Perishable foods or items close to expiry</li>
          </ul>
          <p className="text-gray-700 mb-6 leading-relaxed">
            To complete your return, we require a receipt or proof of purchase.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-gray-700 leading-relaxed">
              <strong>Important:</strong> Please do not send your purchase back to the manufacturer.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Partial Refunds
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            There are certain situations where only partial refunds are granted:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>Any item not in its original condition, is damaged or missing parts for reasons not due to our error.</li>
            <li>Any item that is returned more than 14 days after delivery</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Refunds
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Late or Missing Refunds
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            If you haven&apos;t received a refund yet, first check your bank account again.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Next contact your bank. There is often some processing time before a refund is posted.
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            If you&apos;ve done all of this and you still have not received your refund yet, please contact us at{' '}
            <a href="tel:9810107887" className="text-blue-600 hover:text-blue-800 underline">
              9810107887
            </a>
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Sale Items
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Only regular priced items may be refunded. Sale items cannot be refunded.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Exchanges
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We only replace items if they are expired or defective. If you need to exchange it for the same item, give us a call at{' '}
            <a href="tel:9810107887" className="text-blue-600 hover:text-blue-800 underline">
              9810107887
            </a>{' '}
            and send your item to: The Celiac Store, A373, Defence Colony, New Delhi.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Shipping and Returns
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            To return your product, you should mail your product to: The Celiac Store, A373, Defence Colony, New Delhi.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Depending on where you live, the time it may take for your exchanged product to reach you may vary.
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            If you are returning more expensive items, you may consider using a trackable shipping service or purchasing shipping insurance. We don&apos;t guarantee that we will receive your returned item.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
            <p className="text-gray-700 leading-relaxed">
              Contact us at{' '}
              <a href="tel:9810107887" className="text-blue-600 hover:text-blue-800 underline">
                9810107887
              </a>{' '}
              for questions related to refunds and returns.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default RefundPage
