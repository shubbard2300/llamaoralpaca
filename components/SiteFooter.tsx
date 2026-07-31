"use client";

import { useState } from "react";
import LegalModal from "./LegalModal";

type ModalKey = "privacy" | "terms" | "support" | null;

export default function SiteFooter() {
  const [open, setOpen] = useState<ModalKey>(null);

  return (
    <footer className="site-footer">
      <a
        className="footer-merch-cta"
        href="https://llama-or-alpaca.myspreadshop.com/all"
        target="_blank"
        rel="noreferrer"
        data-tooltip="Tees, mugs & more for llama and alpaca fans"
      >
        <span className="footer-merch-icon" aria-hidden="true">
          🛍️
        </span>
        Shop Llama Or Alpaca Merchandise
        <span className="footer-merch-arrow" aria-hidden="true">
          →
        </span>
      </a>

      <div className="footer-links">
        <button className="footer-link" onClick={() => setOpen("privacy")}>
          Privacy Policy
        </button>
        <span className="footer-sep">|</span>
        <button className="footer-link" onClick={() => setOpen("terms")}>
          Terms and Conditions
        </button>
        <span className="footer-sep">|</span>
        <button className="footer-link" onClick={() => setOpen("support")}>
          Support
        </button>
      </div>
      <span className="footer-tagline">Made for the herd 🦙🐑 · Real photos, credited to their photographers</span>
      <div className="footer-social">
        <a href="https://www.pinterest.com/allamaoralpaca/" target="_blank" rel="noreferrer" aria-label="Pinterest">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3C7.6 3 5 6 5 9.3c0 2 1 4.4 2.9 4.4.4 0 .7-.2.8-.5.1-.3 0-.7-.1-1-.4-.9-.6-1.7-.6-2.6 0-2.3 1.7-4.5 4.7-4.5 2.5 0 4.1 1.5 4.1 3.7 0 2.5-1.1 4.7-2.7 4.7-.9 0-1.5-.7-1.3-1.6.3-1.1.8-2.3.8-3.1 0-.7-.4-1.3-1.2-1.3-.9 0-1.7 1-1.7 2.3 0 .8.3 1.4.3 1.4l-1.1 4.9c-.3 1.4-.1 3.1 0 3.3 0 .1.2.1.3 0 .1-.1 1.5-1.9 2-3.6l.7-2.7c.4.7 1.4 1.3 2.5 1.3 3.3 0 5.6-3 5.6-7 0-3-2.5-5.7-6.4-5.7z" />
          </svg>
        </a>
        <a href="https://x.com/aLlamaOrAlpaca" target="_blank" rel="noreferrer" aria-label="X (Twitter)">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4l7.2 9.2L4.4 20h2.3l5.8-5.9L17 20h3l-7.5-9.6L19.6 4h-2.3l-5.4 5.5L8 4H4z" />
          </svg>
        </a>
        <a href="https://www.facebook.com/llamaoralpaca/" target="_blank" rel="noreferrer" aria-label="Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.3-1.5 1.6-1.5H16V4.2C15.7 4.1 14.8 4 13.7 4c-2.3 0-3.9 1.4-3.9 4v2.5H7v3h2.8V21h3.7z" />
          </svg>
        </a>
      </div>

      {open === "privacy" && (
        <LegalModal title="Privacy Policy" onClose={() => setOpen(null)}>
          <p>
            This privacy policy has been compiled to better serve those who are concerned with how their
            &lsquo;Personally identifiable information&rsquo; (PII) is being used online. PII, as used in US privacy
            law and information security, is information that can be used on its own or with other information to
            identify, contact, or locate a single person, or to identify an individual in context. Please read our
            privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise
            handle your Personally Identifiable Information in accordance with our website.
          </p>

          <h3>What personal information do we collect from the people that visit our blog, website or app?</h3>
          <p>
            When ordering or registering on our site, as appropriate, you may be asked to enter your Name or other
            details to help you with your experience.
          </p>

          <h3>When do we collect information?</h3>
          <p>We collect information from you when you respond to a survey or enter information on our site.</p>

          <h3>How do we use your information?</h3>
          <p>
            We may use the information we collect from you when you register, make a purchase, sign up for our
            newsletter, respond to a survey or marketing communication, surf the website, or use certain other site
            features in the following ways:
          </p>
          <ul>
            <li>To personalize user&rsquo;s experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
            <li>To improve our website in order to better serve you.</li>
          </ul>

          <h3>How do we protect visitor information?</h3>
          <p>We do not use vulnerability scanning and/or scanning to PCI standards.</p>
          <p>We do not use an SSL certificate</p>
          <ul>
            <li>We only provide articles and information, and we never ask for personal or private information</li>
          </ul>

          <h3>Do we use &lsquo;cookies&rsquo;?</h3>
          <p>We do not use cookies for tracking purposes</p>
          <p>
            You can choose to have your computer warn you each time a cookie is being sent, or you can choose to
            turn off all cookies. You do this through your browser (like Internet Explorer) settings. Each browser
            is a little different, so look at your browser&rsquo;s Help menu to learn the correct way to modify your
            cookies.
          </p>
          <p>
            If you disable cookies off, some features will be disabled that make your site experience more
            efficient and some of our services will not function properly.
          </p>
          <p>However, you can still place orders.</p>

          <h3>Third Party Disclosure</h3>
          <p>No, we do not sell, trade, or otherwise transfer to outside parties your personally identifiable information.</p>

          <h3>Third party links</h3>
          <p>We do not include or offer third party products or services on our website.</p>

          <h3>California Online Privacy Protection Act</h3>
          <p>
            CalOPPA is the first state law in the nation to require commercial websites and online services to post
            a privacy policy. The law&rsquo;s reach stretches well beyond California to require a person or company
            in the United States (and conceivably the world) that operates websites collecting personally
            identifiable information from California consumers to post a conspicuous privacy policy on its website
            stating exactly the information being collected and those individuals with whom it is being shared, and
            to comply with this policy. - See more at:{" "}
            <a href="http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf" target="_blank" rel="noreferrer">
              http://consumercal.org/california-online-privacy-protection-act-caloppa/
            </a>
          </p>
          <p>According to CalOPPA we agree to the following:</p>
          <p>Users can visit our site anonymously</p>
          <p>
            Once this privacy policy is created, we will add a link to it on our home page, or as a minimum on the
            first significant page after entering our website.
          </p>
          <p>Our Privacy Policy link includes the word &lsquo;Privacy&rsquo;, and can be easily be found on the page specified above.</p>
          <p>Users will be notified of any privacy policy changes:</p>
          <ul>
            <li>On our Privacy Policy Page</li>
          </ul>
          <p>Users are able to change their personal information:</p>
          <ul>
            <li>By logging in to their account</li>
          </ul>

          <h3>How does our site handle do not track signals?</h3>
          <p>
            We honor do not track signals and do not track, plant cookies, or use advertising when a Do Not Track
            (DNT) browser mechanism is in place.
          </p>

          <h3>Does our site allow third party behavioral tracking?</h3>
          <p>It&rsquo;s also important to note that we do not allow third party behavioral tracking</p>

          <h3>COPPA (Children Online Privacy Protection Act)</h3>
          <p>
            When it comes to the collection of personal information from children under 13, the Children&rsquo;s
            Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, the
            nation&rsquo;s consumer protection agency, enforces the COPPA Rule, which spells out what operators of
            websites and online services must do to protect children&rsquo;s privacy and safety online.
          </p>
          <p>We do not specifically market to children under 13.</p>

          <h3>Fair Information Practices</h3>
          <p>
            The Fair Information Practices Principles form the backbone of privacy law in the United States and the
            concepts they include have played a significant role in the development of data protection laws around
            the globe. Understanding the Fair Information Practice Principles and how they should be implemented is
            critical to comply with the various privacy laws that protect personal information.
          </p>
          <p>
            In order to be in line with Fair Information Practices we will take the following responsive action,
            should a data breach occur:
          </p>
          <p>We will notify the users via in site notification</p>
          <ul>
            <li>Within 1 business day</li>
          </ul>
          <p>
            We also agree to the individual redress principle, which requires that individuals have a right to
            pursue legally enforceable rights against data collectors and processors who fail to adhere to the law.
            This principle requires not only that individuals have enforceable rights against data users, but also
            that individuals have recourse to courts or a government agency to investigate and/or prosecute
            non-compliance by data processors.
          </p>

          <h3>Contacting Us</h3>
          <p>If there are any questions regarding this privacy policy you may contact us using the information below.</p>
          <address className="legal-address">
            llamaoralpaca.com
            <br />
            <a href="mailto:contact@llamaoralpaca.com">contact@llamaoralpaca.com</a>
          </address>
        </LegalModal>
      )}

      {open === "terms" && (
        <LegalModal title="Web Site Terms and Conditions of Use" onClose={() => setOpen(null)}>
          <h3>1. Terms</h3>
          <p>
            By accessing this web site, you are agreeing to be bound by these web site Terms and Conditions of Use,
            all applicable laws and regulations, and agree that you are responsible for compliance with any
            applicable local laws. If you do not agree with any of these terms, you are prohibited from using or
            accessing this site. The materials contained in this web site are protected by applicable copyright and
            trade mark law.
          </p>

          <h3>2. Use License</h3>
          <ol className="legal-ordered">
            <li>
              Permission is granted to temporarily download one copy of the materials (information or software) on
              Llama Or Alpaca&rsquo;s web site for personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this license you may not:
              <ol type="i" className="legal-ordered legal-ordered-nested">
                <li>modify or copy the materials;</li>
                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>attempt to decompile or reverse engineer any software contained on Llama Or Alpaca&rsquo;s web site;</li>
                <li>remove any copyright or other proprietary notations from the materials; or</li>
                <li>transfer the materials to another person or &ldquo;mirror&rdquo; the materials on any other server.</li>
              </ol>
            </li>
            <li>
              This license shall automatically terminate if you violate any of these restrictions and may be
              terminated by Llama Or Alpaca at any time. Upon terminating your viewing of these materials or upon
              the termination of this license, you must destroy any downloaded materials in your possession whether
              in electronic or printed format.
            </li>
          </ol>

          <h3>3. Disclaimer</h3>
          <p>
            The materials on Llama Or Alpaca&rsquo;s web site are provided &ldquo;as is&rdquo;. Llama Or Alpaca
            makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties,
            including without limitation, implied warranties or conditions of merchantability, fitness for a
            particular purpose, or non-infringement of intellectual property or other violation of rights. Further,
            Llama Or Alpaca does not warrant or make any representations concerning the accuracy, likely results, or
            reliability of the use of the materials on its Internet web site or otherwise relating to such materials
            or on any sites linked to this site.
          </p>

          <h3>4. Limitations</h3>
          <p>
            In no event shall Llama Or Alpaca or its suppliers be liable for any damages (including, without
            limitation, damages for loss of data or profit, or due to business interruption,) arising out of the
            use or inability to use the materials on Llama Or Alpaca&rsquo;s Internet site, even if Llama Or Alpaca
            or a Llama Or Alpaca authorized representative has been notified orally or in writing of the possibility
            of such damage. Because some jurisdictions do not allow limitations on implied warranties, or
            limitations of liability for consequential or incidental damages, these limitations may not apply to
            you.
          </p>

          <h3>5. Revisions and Errata</h3>
          <p>
            The materials appearing on Llama Or Alpaca&rsquo;s web site could include technical, typographical, or
            photographic errors. Llama Or Alpaca does not warrant that any of the materials on its web site are
            accurate, complete, or current. Llama Or Alpaca may make changes to the materials contained on its web
            site at any time without notice. Llama Or Alpaca does not, however, make any commitment to update the
            materials.
          </p>

          <h3>6. Links</h3>
          <p>
            Llama Or Alpaca has not reviewed all of the sites linked to its Internet web site and is not
            responsible for the contents of any such linked site. The inclusion of any link does not imply
            endorsement by Llama Or Alpaca of the site. Use of any such linked web site is at the user&rsquo;s own
            risk.
          </p>

          <h3>7. Site Terms of Use Modifications</h3>
          <p>
            Llama Or Alpaca may revise these terms of use for its web site at any time without notice. By using
            this web site you are agreeing to be bound by the then current version of these Terms and Conditions of
            Use.
          </p>

          <h3>8. Governing Law</h3>
          <p>
            Any claim relating to Llama Or Alpaca&rsquo;s web site shall be governed by the laws of the State of CA
            without regard to its conflict of law provisions.
          </p>

          <p>General Terms and Conditions applicable to Use of a Web Site.</p>
          <p>
            We are committed to conducting our business in accordance with these principles in order to ensure that
            the confidentiality of personal information is protected and maintained.
          </p>
        </LegalModal>
      )}

      {open === "support" && (
        <LegalModal title="Support" onClose={() => setOpen(null)}>
          <details className="faq-item" open>
            <summary>How do I play?</summary>
            <p>
              Pick Streak or Blitz from the home screen. You&rsquo;ll be shown a real photo and two buttons:
              Llama and Alpaca. Guess right to keep going. In Streak mode, one wrong guess ends the round; in
              Blitz mode you get 60 seconds to rack up as many correct guesses as you can. Keyboard shortcuts{" "}
              <kbd>L</kbd> and <kbd>A</kbd> work too.
            </p>
          </details>
          <details className="faq-item">
            <summary>Where do the photos come from?</summary>
            <p>
              Real, freely-licensed photography sourced from Wikimedia Commons, plus photos submitted by players.
              Photographer credit is shown under each photo during play.
            </p>
          </details>
          <details className="faq-item">
            <summary>Can I submit my own llama or alpaca photo?</summary>
            <p>
              Yes — create an account, then use the Upload page to submit a photo and tag it as a llama or an
              alpaca.
            </p>
          </details>
          <details className="faq-item">
            <summary>Why isn&rsquo;t my uploaded photo showing up in the game yet?</summary>
            <p>
              Every submitted photo is reviewed before it joins the game, to keep things accurate and appropriate.
              You can check the status of your uploads (pending, approved, or rejected) on your Upload page.
            </p>
          </details>
          <details className="faq-item">
            <summary>Is my account information safe?</summary>
            <p>
              We only ask for an email, a display name, and a password to create an account — see our Privacy
              Policy for the full details on what we collect and how it&rsquo;s handled.
            </p>
          </details>
          <details className="faq-item">
            <summary>I found a bug, a mislabeled photo, or something inappropriate — who do I tell?</summary>
            <p>Email us using the address below and we&rsquo;ll take a look.</p>
          </details>

          <div className="support-contact">
            <h3>Still need help?</h3>
            <address className="legal-address">
              <a href="mailto:contact@llamaoralpaca.com">contact@llamaoralpaca.com</a>
              <br />
              llamaoralpaca.com
            </address>
          </div>
        </LegalModal>
      )}
    </footer>
  );
}
