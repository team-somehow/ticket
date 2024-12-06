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

  return (
    <nav
      className="sticky top-0 z-50 bg-bg-secondary border-2 border-border shadow-light"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Home Button */}
          <button
            onClick={() => handleNavigate("/")}
            className="px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
          >
            Home
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={() => handleNavigate("/events")}
              className="px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
            >
              Upcoming Events
            </button>

            {isConnected && (
              <>
                <button
                  onClick={() => handleNavigate("/my-events")}
                  className="px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                >
                  My Events
                </button>
                <button
                  onClick={() => handleNavigate("/my-tickets")}
                  className="px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                >
                  My Tickets
                </button>
                <button
                  onClick={() => handleNavigate("/marketplace")}
                  className="px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                >
                  Marketplace
                </button>
              </>
            )}

            {isConnected ? (
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
              >
                Disconnect
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                >
                  Login
                </button>
                {dropdownVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-bg border-2 border-border rounded-base shadow-light">
                    {dropdownItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick();
                          setDropdownVisible(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-text hover:bg-main hover:text-text"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent transition-all"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t-2 border-border bg-bg-secondary">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleNavigate("/events")}
              className="w-full mb-2 px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
            >
              Upcoming Events
            </button>

            {isConnected && (
              <>
                <button
                  onClick={() => handleNavigate("/my-events")}
                  className="w-full mb-2 px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                >
                  My Events
                </button>
                <button
                  onClick={() => handleNavigate("/my-tickets")}
                  className="w-full mb-2 px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                >
                  My Tickets
                </button>
                <button
                  onClick={() => handleNavigate("/marketplace")}
                  className="w-full mb-2 px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                >
                  Marketplace
                </button>
              </>
            )}

            {isConnected ? (
              <button
                onClick={handleDisconnect}
                className="w-full px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
              >
                Disconnect
              </button>
            ) : (
              <div className="space-y-2">
                {dropdownItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
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
