"use client";

import React, { useState } from "react";
import JoinSpaceModal from "./JoinSpaceModal";

const ModalButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="bg-gray-900 text-white hover:bg-gray-800 transition-colors px-6 py-3 rounded-lg font-medium flex items-center space-x-2 cursor-pointer"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Join Space</span>
      </button>

      <JoinSpaceModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default ModalButton;
