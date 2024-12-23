// src/components/CustomizeInputs/CustomPackSelect.jsx

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomPackSelect = ({ index, item, onItemChange, packs }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedPack = packs.find(p => p.id === item.pack_id);

    const handleSelect = (pack) => {
        // On met à jour le pack_id et on réinitialise product_id, prix, etc.
        onItemChange(index, "pack_id", pack.id);
        onItemChange(index, "product_id", '');
        onItemChange(index, "prix", 0);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex items-center border rounded shadow-sm focus-within:ring-2 focus-within:ring-nextmux-green">
                <input
                    type="text"
                    value={selectedPack ? selectedPack.name : ""}
                    onChange={() => {}}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Sélectionnez un pack"
                    className="w-full p-3 pr-10 focus:outline-none"
                    readOnly
                />
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute right-2 p-2 rounded hover:bg-gray-200 transition-colors"
                >
                    <ChevronDown size={20} className="text-gray-500" />
                </button>
            </div>

            {isDropdownOpen && (
                <ul className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg w-full max-h-40 overflow-y-auto">
                    {packs.length > 0 ? (
                        packs.map((pack) => (
                            <li
                                key={pack.id}
                                className="p-2 hover:bg-nextmux-green hover:text-white cursor-pointer"
                                onClick={() => handleSelect(pack)}
                            >
                                {pack.name}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500 text-center">Aucun pack disponible</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CustomPackSelect;
