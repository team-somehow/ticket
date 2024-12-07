"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSource } from "../../context/SourceContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { wallet, connect, disconnect } = useSource();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const isConnected = !!wallet;

  const handleDisconnect = () => {
    disconnect();
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const buttonStyles =
    "w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-white border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase tracking-wider";
  const mobileButtonStyles =
    "w-full px-4 py-3 text-base font-neo text-neo-black bg-neo-white border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase tracking-wider";

  return (
    <nav className="sticky top-0 z-50 bg-neo-white border-b-neo border-neo-black shadow-neo-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Home Button */}
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 text-base font-neo-display text-neo-black bg-neo-primary border-neo border-neo-black rounded-lg shadow-neo hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
          >
            Fanbase
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <button
              onClick={() => navigate("/events")}
              className={buttonStyles}
            >
              Events
            </button>

            {isConnected && (
              <>
                <button
                  onClick={() => navigate("/my-events")}
                  className={buttonStyles}
                >
                  My Events
                </button>
                <button
                  onClick={() => navigate("/my-tickets")}
                  className={buttonStyles}
                >
                  Tickets
                </button>
                <button
                  onClick={() => navigate("/marketplace")}
                  className={buttonStyles}
                >
                  Market
                </button>
              </>
            )}

            {isConnected ? (
              <button
                onClick={handleDisconnect}
                className="px-6 py-3 text-base font-neo text-neo-black bg-neo-secondary border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
              >
                Disconnect
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="px-6 py-3 text-base font-neo text-neo-black bg-neo-secondary border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
                >
                  Connect
                </button>
                {dropdownVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-neo-white border-neo border-neo-black rounded-lg shadow-neo-lg overflow-hidden">
                    <button
                      onClick={connect}
                      className="block w-full px-4 py-3 text-left font-neo text-neo-black hover:bg-neo-accent border-b border-neo-black last:border-b-0"
                    >
                      Connect
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 bg-neo-primary border-neo border-neo-black rounded-lg shadow-neo hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t-neo border-neo-black bg-neo-white">
          <div className="p-4 space-y-3">
            <button
              onClick={() => navigate("/events")}
              className={mobileButtonStyles}
            >
              Events
            </button>

            {isConnected && (
              <>
                <button
                  onClick={() => navigate("/my-events")}
                  className={mobileButtonStyles}
                >
                  My Events
                </button>
                <button
                  onClick={() => navigate("/my-tickets")}
                  className={mobileButtonStyles}
                >
                  My Tickets
                </button>
                <button
                  onClick={() => navigate("/marketplace")}
                  className={mobileButtonStyles}
                >
                  Marketplace
                </button>
              </>
            )}

            {isConnected ? (
              <button
                onClick={handleDisconnect}
                className={`${mobileButtonStyles} bg-neo-secondary`}
              >
                Disconnect
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={connect}
                  className={`${mobileButtonStyles} bg-neo-secondary`}
                >
                  Connect
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
