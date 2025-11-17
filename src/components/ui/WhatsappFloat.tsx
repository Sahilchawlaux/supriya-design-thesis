import React from "react";
import Whatsapp from "../../assets/WhatsApp.svg"

const WHATSAPP_URL = "https://wa.me/message/LODKRHSZAZCCI1"; // Replace with your WhatsApp number

const WhatsappFloat: React.FC = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed z-50 bottom-6 right-6 bg-green-500 hover:bg-green-600 rounded-full shadow-lg p-3 flex items-center justify-center transition-colors duration-200"
    style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
  >
    <img src={Whatsapp} alt="WhatsApp" className="w-8 h-8" />
  </a>
);

export default WhatsappFloat; 