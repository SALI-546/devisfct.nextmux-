import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomInputSelect = ({ value, onChange, options, placeholder }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const dropdownRef = useRef(null); 

    // Gérer la sélection d'une option
    const handleSelect = (option) => {
        setInputValue(option);
        onChange(option);
        setIsDropdownOpen(false); 
    };

    // Gérer le changement dans le champ d'entrée
    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        onChange(val); 
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
            {/* Input text avec bouton dropdown */}
            <div className="flex items-center border rounded shadow-sm focus-within:ring-2 focus-within:ring-nextmux-green">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsDropdownOpen(true)} 
                    placeholder={placeholder || "Entrez une valeur"}
                    className="w-full p-3 pr-10 focus:outline-none"
                />
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute right-2 flex items-center justify-center p-2 rounded hover:bg-gray-200 transition-colors"
                >
                    <ChevronDown size={20} className="text-gray-500" />
                </button>
            </div>

            {/* Liste déroulante */}
            {isDropdownOpen && (
                <ul className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg w-full max-h-40 overflow-y-auto">
                    {options.length > 0 ? (
                        options.map((option, index) => (
                            <li
                                key={index}
                                className="p-2 hover:bg-nextmux-green hover:text-white cursor-pointer"
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500 text-center">Aucune option disponible</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CustomInputSelect;
