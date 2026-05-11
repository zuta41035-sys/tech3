import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const ContactUs = () => {
  return (
    <div className="text-center p-10 bg-gray-100 rounded-xl max-w-sm mx-auto shadow-md">
      <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
      <p className="text-gray-600 mb-5">Follow us on social media!</p>

      <div className="flex items-center justify-center gap-4 mb-6">
        <a
          href="https://www.facebook.com/share/18WVRV6USZ/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
        >
          <Image
            src={assets.facebook_icon}
            alt="facebook icon"
            className="w-8 h-8"
          />
        </a>
        <a
          href="##"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
        >
          <Image
            src={assets.twitter_icon}
            alt="twitter icon"
            className="w-8 h-8"
          />
        </a>
        <a
          href="##"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
        >
          <Image
            src={assets.instagram_icon}
            alt="instagram icon"
            className="w-8 h-8"
          />
        </a>
      </div>
    </div>
  );
};

export default ContactUs;
