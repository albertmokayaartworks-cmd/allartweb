import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">ARUVIAH PRIVACY POLICY</h1>
        <p className="text-gray-600 mb-8">Last Updated: November 2025 | Effective Date: November 2025</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>Welcome to Aruviah. We are committed to protecting your privacy and personal data. This Privacy Policy explains how Aruviah ("we," "us," or "our") collects, uses, stores, shares, and protects your personal information when you use our e-commerce platform, website, and mobile applications (collectively, the "Platform").</p>
            <p className="mt-4">This Privacy Policy complies with the Kenya Data Protection Act, 2019, and applicable laws in the East African Community (EAC).</p>
            <p className="mt-4">By using Aruviah, you consent to the practices described in this Privacy Policy. If you do not agree, please discontinue use of the Platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data Controller Information</h2>
            <p>Aruviah is the Data Controller responsible for your personal data.</p>
            <div className="bg-gray-100 p-4 rounded mt-4 space-y-2">
              <p><strong>Company Name:</strong> Aruviah Limited</p>
              <p><strong>Registered Address:</strong> Nairobi, Kenya</p>
              <p><strong>Email:</strong> privacy@aruviah.co.ke</p>
              <p><strong>Phone:</strong> +254 (Contact Number)</p>
              <p><strong>Data Protection Officer:</strong> Available upon request</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Personal Information You Provide</h3>
            <p>When you register, make purchases, or interact with the Platform, you may provide:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>Account Information:</strong> Full name, email address, phone number, date of birth, gender</li>
              <li><strong>Identity Verification:</strong> National ID number, passport number, KRA PIN (for sellers)</li>
              <li><strong>Payment Information:</strong> M-Pesa number, bank account details, credit/debit card information</li>
              <li><strong>Delivery Information:</strong> Physical address, postal code, delivery instructions</li>
              <li><strong>Business Information (for Sellers):</strong> Business name, registration number, tax information, business location</li>
              <li><strong>Communication Data:</strong> Messages, reviews, ratings, customer support inquiries</li>
              <li><strong>Profile Information:</strong> Profile photo, preferences, wish lists</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Information Collected Automatically</h3>
            <p>When you use the Platform, we automatically collect:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>Device Information:</strong> IP address, device type, operating system, browser type, mobile network information</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, search queries, purchase history</li>
              <li><strong>Location Data:</strong> General location based on IP address; precise location if you enable GPS</li>
              <li><strong>Cookies and Tracking Technologies:</strong> Session cookies, persistent cookies, web beacons, pixel tags</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.3 Information from Third Parties</h3>
            <p>We may receive information from:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Payment Processors: M-Pesa, banks, payment gateways</li>
              <li>Social Media: If you link your Facebook, Google, or other social accounts</li>
              <li>Logistics Partners: Delivery status, tracking information</li>
              <li>Credit Reference Bureaus: For credit assessment (with your consent)</li>
              <li>Marketing Partners: Demographics and interests for targeted advertising</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Your Information</h2>
            <p>We use your personal data for the following purposes:</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 To Provide and Improve Our Services</h3>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Create and manage your account</li>
              <li>Process orders, payments, and deliveries</li>
              <li>Facilitate communication between Buyers and Sellers</li>
              <li>Provide customer support</li>
              <li>Personalize your shopping experience</li>
              <li>Improve Platform functionality and user experience</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 For Security and Fraud Prevention</h3>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Verify your identity</li>
              <li>Detect and prevent fraud, unauthorized transactions, and illegal activities</li>
              <li>Monitor and protect against security threats</li>
              <li>Comply with anti-money laundering regulations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.3 For Marketing and Communications</h3>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Send promotional emails, SMS, and push notifications (with your consent)</li>
              <li>Provide personalized product recommendations</li>
              <li>Conduct surveys and request feedback</li>
              <li>Inform you about new features, products, and offers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.4 For Legal and Compliance Purposes</h3>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Comply with Kenyan and EAC laws and regulations</li>
              <li>Respond to legal requests from authorities</li>
              <li>Enforce our Terms and Conditions</li>
              <li>Resolve disputes and investigate complaints</li>
              <li>Maintain records for tax and accounting purposes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.5 For Analytics and Research</h3>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Analyze Platform usage and trends</li>
              <li>Conduct market research</li>
              <li>Generate statistical reports (anonymized data)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Legal Basis for Processing</h2>
            <p>Under the Kenya Data Protection Act, 2019, we process your data based on:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>Consent:</strong> You have given explicit consent (e.g., marketing communications)</li>
              <li><strong>Contractual Necessity:</strong> Processing is necessary to fulfill our contract with you (e.g., order processing)</li>
              <li><strong>Legal Obligation:</strong> Processing is required to comply with Kenyan laws (e.g., tax reporting)</li>
              <li><strong>Legitimate Interest:</strong> Processing is necessary for our legitimate business interests (e.g., fraud prevention, analytics)</li>
              <li><strong>Vital Interest:</strong> Processing is necessary to protect your life or health (rare circumstances)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. How We Share Your Information</h2>
            <p className="font-semibold">We do not sell your personal data. However, we may share your information with:</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.1 Service Providers and Business Partners</h3>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Payment Processors: M-Pesa (Safaricom), banks, Visa, Mastercard</li>
              <li>Logistics and Delivery Partners: Courier companies, postal services</li>
              <li>Cloud Hosting Providers: For data storage and Platform infrastructure</li>
              <li>Marketing and Analytics Tools: Google Analytics, Facebook Pixel, email service providers</li>
              <li>Customer Support Tools: Live chat providers, ticketing systems</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.2 Sellers and Buyers</h3>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Buyers' contact and delivery information is shared with Sellers to fulfill orders</li>
              <li>Sellers' business information is visible to Buyers for transparency</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.3 Legal and Regulatory Authorities</h3>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Kenya Revenue Authority (KRA) for tax compliance</li>
              <li>Law enforcement agencies when legally required</li>
              <li>Courts and arbitrators in dispute resolution</li>
              <li>Office of the Data Protection Commissioner (Kenya)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.4 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new entity.</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.5 With Your Consent</h3>
            <p>We may share data with third parties when you explicitly consent.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. International Data Transfers</h2>
            <p>Your data is primarily stored and processed in Kenya. However, some service providers may be located outside Kenya or the EAC.</p>
            <p className="mt-4">When transferring data internationally, we ensure:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Adequate data protection safeguards are in place</li>
              <li>Compliance with the Kenya Data Protection Act, 2019</li>
              <li>Use of Standard Contractual Clauses or other approved mechanisms</li>
              <li>You will be informed if your data is transferred outside Kenya</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p>We retain your personal data for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.</p>
            <div className="bg-gray-100 p-4 rounded mt-4 space-y-2">
              <p><strong>Retention Periods:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account Data: Retained while active + 7 years after closure (legal/tax)</li>
                <li>Transaction Records: 7 years (Kenya tax law requirement)</li>
                <li>Marketing Communications: Until unsubscribe or consent withdrawal</li>
                <li>Customer Support Records: 3 years after resolution</li>
                <li>Cookies and Usage Data: Varies by type</li>
              </ul>
            </div>
            <p className="mt-4">After retention periods expire, we will securely delete or anonymize your data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Your Data Protection Rights</h2>
            <p>Under the Kenya Data Protection Act, 2019, you have the following rights:</p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">9.1 Right to Access</h3>
            <p>You can request a copy of the personal data we hold about you.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">9.2 Right to Rectification</h3>
            <p>You can request correction of inaccurate or incomplete data.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">9.3 Right to Erasure (Right to be Forgotten)</h3>
            <p>You can request deletion of your data in certain circumstances.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">9.4 Right to Restrict Processing</h3>
            <p>You can request that we limit how we use your data.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">9.5 Right to Data Portability</h3>
            <p>You can request your data in a structured, machine-readable format.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">9.6 Right to Object</h3>
            <p>You can object to processing based on legitimate interests or for marketing purposes.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">9.7 Right to Withdraw Consent</h3>
            <p>You can withdraw consent at any time for consent-based processing.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">9.8 Right to Lodge a Complaint</h3>
            <p>You can file a complaint with the Office of the Data Protection Commissioner (Kenya):</p>
            <div className="bg-gray-100 p-4 rounded mt-3 space-y-2">
              <p><strong>Website:</strong> www.odpc.go.ke</p>
              <p><strong>Email:</strong> info@odpc.go.ke</p>
              <p><strong>Phone:</strong> +254 20 2675316</p>
            </div>
            <p className="mt-4"><strong>To exercise your rights:</strong> Contact us at privacy@aruviah.co.ke. We will respond within 30 days as required by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data, including:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>Encryption:</strong> SSL/TLS encryption for data transmission; encryption at rest for stored data</li>
              <li><strong>Access Controls:</strong> Role-based access; multi-factor authentication for staff</li>
              <li><strong>Firewalls and Intrusion Detection:</strong> To prevent unauthorized access</li>
              <li><strong>Regular Security Audits:</strong> Vulnerability assessments and penetration testing</li>
              <li><strong>Secure Payment Processing:</strong> PCI-DSS compliant payment systems</li>
              <li><strong>Employee Training:</strong> Regular training on data protection and security</li>
            </ul>
            <p className="mt-4">However, no system is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Cookies and Tracking Technologies</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">11.1 What are Cookies?</h3>
            <p>Cookies are small text files stored on your device when you visit the Platform.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">11.2 Types of Cookies We Use</h3>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>Essential Cookies:</strong> Necessary for the Platform to function (e.g., shopping cart, login)</li>
              <li><strong>Performance Cookies:</strong> Collect anonymous data on Platform usage (e.g., Google Analytics)</li>
              <li><strong>Functionality Cookies:</strong> Remember your preferences (e.g., language, currency)</li>
              <li><strong>Targeting/Advertising Cookies:</strong> Used to deliver personalized ads (e.g., Facebook Pixel, Google Ads)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">11.3 Managing Cookies</h3>
            <p>You can control cookies through your browser settings. Note that disabling cookies may affect Platform functionality.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Third-Party Links</h2>
            <p>The Platform may contain links to third-party websites, social media platforms, or services. We are not responsible for the privacy practices of these third parties. Please review their privacy policies before providing personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Children's Privacy</h2>
            <p>Aruviah is not intended for users under 18 years old. We do not knowingly collect personal data from children. If we discover that a child's data has been collected, we will delete it immediately.</p>
            <p className="mt-4">Parents or guardians who believe their child's data has been collected should contact us at privacy@aruviah.co.ke.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Marketing Communications</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">14.1 Consent</h3>
            <p>We will send marketing communications only with your consent. You can opt-in during registration or later in your account settings.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">14.2 Opting Out</h3>
            <p>You can unsubscribe from marketing emails by:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Clicking the "Unsubscribe" link in emails</li>
              <li>Adjusting settings in your account</li>
              <li>Contacting us at privacy@aruviah.co.ke</li>
            </ul>
            <p className="mt-4"><strong>Note:</strong> You will still receive transactional emails (e.g., order confirmations, security alerts) even if you opt out of marketing.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Changes in laws or regulations</li>
              <li>New features or services</li>
              <li>Improvements to data protection practices</li>
            </ul>
            <p className="mt-4"><strong>Notification of Changes:</strong></p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>We will notify you via email or Platform notification</li>
              <li>The "Last Updated" date at the top will be revised</li>
              <li>Continued use of the Platform after changes constitutes acceptance</li>
            </ul>
            <p className="mt-4">We encourage you to review this Privacy Policy periodically.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Us</h2>
            <p>If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:</p>
            
            <div className="bg-gray-100 p-4 rounded mt-4 space-y-2">
              <p className="font-semibold">Aruviah Privacy Team</p>
              <p><strong>Email:</strong> privacy@aruviah.co.ke</p>
              <p><strong>Phone:</strong> +254 (Contact Number)</p>
              <p><strong>Address:</strong> Nairobi, Kenya</p>
            </div>

            <div className="bg-gray-100 p-4 rounded mt-4 space-y-2">
              <p className="font-semibold">Office of the Data Protection Commissioner (Kenya)</p>
              <p><strong>Website:</strong> www.odpc.go.ke</p>
              <p><strong>Email:</strong> info@odpc.go.ke</p>
              <p><strong>Phone:</strong> +254 20 2675316</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Compliance with Kenyan Laws</h2>
            <p>This Privacy Policy complies with:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Kenya Data Protection Act, 2019</li>
              <li>Kenya Information and Communications Act (Cap 411A)</li>
              <li>Consumer Protection Act, 2012</li>
              <li>Kenya National Payment Systems Regulations</li>
              <li>East African Community Data Protection Regulations (where applicable)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Consent</h2>
            <p>By using Aruviah, you acknowledge that you have read, understood, and agree to this Privacy Policy.</p>
            <p className="mt-4">For sensitive processing (e.g., ID numbers, payment data), we will obtain your explicit consent where required by law.</p>
          </section>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mt-12">
            <p className="text-sm text-blue-900">
              <strong>IMPORTANT:</strong> This Privacy Policy complies with the Kenya Data Protection Act, 2019, and other applicable regulations. We are committed to protecting your privacy and maintaining your trust by implementing robust data protection measures in accordance with Kenyan and East African law.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
