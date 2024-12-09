// src/components/CustomizeInputs/CustomProductSelect.jsx

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomProductSelect = ({
    index,
    item,
    onItemChange,
    products, // Liste des produits avec leurs quantités, prix et TVA
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(item.product_id || ""); // product_id
    const dropdownRef = useRef(null);

    // Trouver le produit sélectionné pour afficher son nom
    const selectedProduct = products.find(p => p.id === selectedProductId);

    // Gérer la sélection d'un produit
    const handleSelect = (product) => {
        setSelectedProductId(product.id);
        onItemChange(index, "product_id", product.id); // Met à jour product_id
        onItemChange(index, "prix", product.unitPrice); // Met à jour prix
        onItemChange(index, "tva", product.tva); // Met à jour tva
        onItemChange(index, "quantite", product.defaultQuantity); // Met à jour quantite
        setIsDropdownOpen(false); // Ferme la liste déroulante
    };

    // Gérer les changements dans le champ d'entrée (recherche) - désactivé
    const handleInputChange = (e) => {
        // Optionnel: implémenter une fonctionnalité de recherche
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
                    value={selectedProduct ? selectedProduct.name : ""}
                    onChange={handleInputChange}
                    onFocus={() => setIsDropdownOpen(true)} // Ouvre la liste au focus
                    placeholder="Sélectionnez un produit"
                    className="w-full p-3 pr-10 focus:outline-none"
                    readOnly // Rend l'input en lecture seule pour éviter la saisie libre
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
                        products.map((product) => (
                            <li
                                key={product.id}
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
