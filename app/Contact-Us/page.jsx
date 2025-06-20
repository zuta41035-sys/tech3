import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { assets } from "@/assets/assets";
import Image from "next/image";

const ContactUs = () => {
  return (
      <>
        <Navbar />
          <div className="text-center p-10 bg-gray-100 rounded-xl max-w-sm mx-auto shadow-md">
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p className="text-gray-600 mb-5">Follow us on social media!</p>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <a
                href="https://www.facebook.com/share/19PEvYTHmt/?mibextid=wwXIfr"
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
                href="https://www.twitter.com/yourhandle"
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
                href="https://www.instagram.com/yu335ki?igsh=MTdib2NvemFzdGJ4bg%3D%3D&utm_source=qr"
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
        <Footer />
      </>
    );
};

export default ContactUs;
