"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect, disconnect } from "starknetkit";
import { Menu, X } from "lucide-react";

import { WebWalletConnector } from "starknetkit/webwallet";
import { InjectedConnector } from "starknetkit/injected";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [account, setAccount] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      const { wallet, connectorData } = await connect({
        connectors: [
          new WebWalletConnector(),
          new InjectedConnector({ options: { id: "braavos" } }),
        ],
      });
      setAccount(connectorData?.account ?? null);
      console.log("Connected account:", account);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setAccount(null);
    console.log("Disconnected");
  };

  const isConnected = account !== null;

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

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
              className="w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-white border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
            >
              Events
            </button>

            {isConnected && (
              <>
                <button
                  onClick={() => navigate("/my-events")}
                  className="w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-white border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
                >
                  My Events
                </button>
                <button
                  onClick={() => navigate("/my-tickets")}
                  className="w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-white border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
                >
                  Tickets
                </button>
                <button
                  onClick={() => navigate("/marketplace")}
                  className="w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-white border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
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
              <button
                onClick={handleConnect}
                className="px-6 py-3 text-base font-neo text-neo-black bg-neo-secondary border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
              >
                Connect
              </button>
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
              className="w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-white border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
            >
              Events
            </button>

            {isConnected && (
              <>
                <button
                  onClick={() => navigate("/my-events")}
                  className="w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-white border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
                >
                  My Events
                </button>
                <button
                  onClick={() => navigate("/my-tickets")}
                  className="w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-white border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
                >
                  My Tickets
                </button>
                <button
                  onClick={() => navigate("/marketplace")}
                  className="w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-white border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
                >
                  Marketplace
                </button>
              </>
            )}

            {isConnected ? (
              <button
                onClick={handleDisconnect}
                className="w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-secondary border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-secondary border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
