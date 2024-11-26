import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomProductSelect = ({
    index,
    item,
    onItemChange,
    products, // Liste des produits avec leurs quantités, prix et TVA
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [inputValue, setInputValue] = useState(item.description || ""); // Description de l'article
    const dropdownRef = useRef(null);

    // Gérer la sélection d'un produit
    const handleSelect = (product) => {
        setInputValue(product.name); // Met à jour la description avec le nom du produit
        onItemChange(index, "description", product.name); // Met à jour la description
        onItemChange(index, "quantite", product.defaultQuantity); // Quantité par défaut
        onItemChange(index, "prix", product.unitPrice); // Prix unitaire
        onItemChange(index, "tva", product.tva); // TVA
        setIsDropdownOpen(false); // Ferme la liste déroulante
    };

    // Gérer les changements dans le champ d'entrée (saisie libre)
    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        onItemChange(index, "description", val); // Met à jour la description dans le parent
        setIsDropdownOpen(false); // Fermer la liste déroulante si l'utilisateur tape
    };

    // Fermer la liste déroulante lorsqu'on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false); // Ferme la liste déroulante
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
                    onFocus={() => setIsDropdownOpen(true)} // Ouvre la liste au focus
                    placeholder="Entrez un nom"
                    className="w-full p-3 pr-10 focus:outline-none"
                />
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle liste déroulante
                    className="absolute right-2 flex items-center justify-center p-2 rounded hover:bg-gray-200 transition-colors"
                >
                    <ChevronDown size={20} className="text-gray-500" />
                </button>
            </div>

            {/* Liste déroulante */}
            {isDropdownOpen && (
                <ul className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg w-full max-h-40 overflow-y-auto">
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <li
                                key={index}
                                className="p-2 hover:bg-nextmux-green hover:text-white cursor-pointer"
                                onClick={() => handleSelect(product)}
                            >
                                {product.name}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500 text-center">Aucun produit disponible</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CustomProductSelect;
