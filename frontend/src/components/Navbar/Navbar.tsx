"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConnect, useDisconnect } from "wagmi";
import { Menu, X } from "lucide-react";
import useUserAccount from "../../hooks/account/useUserAccount";

const Navbar = () => {
  const navigate = useNavigate();
  const { status } = useUserAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connect } = useConnect();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const isConnected = status === "connected";

  const handleDisconnect = () => {
    disconnect();
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const dropdownItems = connectors.map((connector) => ({
    name: connector.name,
    onClick: () => {
      connect({ connector });
      setIsMenuOpen(false);
    },
  }));

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

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
            onClick={() => handleNavigate("/")}
            className="px-6 py-2 text-base font-neo-display text-neo-black bg-neo-primary border-neo border-neo-black rounded-lg shadow-neo hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
          >
            Fanbase
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <button
              onClick={() => handleNavigate("/events")}
              className={buttonStyles}
            >
              Events
            </button>

            {isConnected && (
              <>
                <button
                  onClick={() => handleNavigate("/my-events")}
                  className={buttonStyles}
                >
                  My Events
                </button>
                <button
                  onClick={() => handleNavigate("/my-tickets")}
                  className={buttonStyles}
                >
                  Tickets
                </button>
                <button
                  onClick={() => handleNavigate("/marketplace")}
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
                    {dropdownItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick();
                          setDropdownVisible(false);
                        }}
                        className="block w-full px-4 py-3 text-left font-neo text-neo-black hover:bg-neo-accent border-b border-neo-black last:border-b-0"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
                {/* <div className="absolute right-0 mt-2 w-48 bg-neo-white border-neo border-neo-black rounded-lg shadow-neo-lg overflow-hidden">
                  <button
                    className="block w-full px-4 py-3 text-left font-neo text-neo-black hover:bg-neo-accent border-b border-neo-black last:border-b-0"
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </button>
                </div> */}
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
              onClick={() => handleNavigate("/events")}
              className={mobileButtonStyles}
            >
              Events
            </button>

            {isConnected && (
              <>
                <button
                  onClick={() => handleNavigate("/my-events")}
                  className={mobileButtonStyles}
                >
                  My Events
                </button>
                <button
                  onClick={() => handleNavigate("/my-tickets")}
                  className={mobileButtonStyles}
                >
                  My Tickets
                </button>
                <button
                  onClick={() => handleNavigate("/marketplace")}
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
                {dropdownItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`${mobileButtonStyles} bg-neo-secondary`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
