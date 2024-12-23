import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus } from "lucide-react";

const CustomFeatureSelect = ({ index, item, onItemChange, packs, onAddNewProduct }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showNewProductForm, setShowNewProductForm] = useState(false);
    const [newProductData, setNewProductData] = useState({
        name: '',
        description: '',
        price_with_content: 0,
    });

    const dropdownRef = useRef(null);

    const pack = packs.find(p => p.id === item.pack_id);
    const [features, setFeatures] = useState(pack ? [...pack.features] : []);

    useEffect(() => {
        if (pack) {
            setFeatures([...pack.features]);
        } else {
            setFeatures([]);
        }
    }, [pack]);

    const selectedFeature = features.find(f => f.id === item.product_id);

    const handleSelect = (feature) => {
        // On met à jour l'item pour refléter le produit sélectionné
        onItemChange(index, "product_id", feature.id);
        onItemChange(index, "prix", feature.price_with_content);

        // Comme c'est un produit existant, remettre is_new_product à false (si jamais)
        onItemChange(index, "is_new_product", false);
        onItemChange(index, "new_product_name", '');
        onItemChange(index, "new_product_description", '');
        onItemChange(index, "new_product_price", 0);

        setIsDropdownOpen(false);
    };

    const handleAddNewProductSubmit = (e) => {
        e.preventDefault();
        if (!newProductData.name.trim()) return;

        // Créer un ID fictif pour le nouveau produit côté frontend
        const newFeatureId = Date.now();

        const newFeature = {
            id: newFeatureId,
            name: newProductData.name,
            description: newProductData.description,
            price_with_content: Number(newProductData.price_with_content),
        };

        // Ajouter dans la liste localement
        setFeatures(prev => [...prev, newFeature]);

        // Réinitialiser le formulaire
        setNewProductData({
            name: '',
            description: '',
            price_with_content: 0,
        });
        setShowNewProductForm(false);

        // Sélectionner directement le nouveau produit
        handleSelect(newFeature);

        // Marquer cet item comme un produit nouveau
        onItemChange(index, "is_new_product", true);
        onItemChange(index, "new_product_name", newFeature.name);
        onItemChange(index, "new_product_description", newFeature.description || '');
        onItemChange(index, "new_product_price", newFeature.price_with_content);

        // Appeler onAddNewProduct pour l'ajouter dans packs globalement
        if (pack) {
            onAddNewProduct(pack.id, newFeature);
        }
    };

    const handleInputChange = (field, value) => {
        setNewProductData(prev => ({
            ...prev,
            [field]: value
        }));
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
                    value={selectedFeature ? `${selectedFeature.name} - ${selectedFeature.price_with_content.toLocaleString()} XOF` : ""}
                    onChange={() => {}}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Sélectionnez une fonctionnalité"
                    className="w-full p-3 pr-10 focus:outline-none"
                    readOnly
                />
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute right-8 flex items-center justify-center p-2 rounded hover:bg-gray-200 transition-colors"
                >
                    <ChevronDown size={20} className="text-gray-500" />
                </button>
                <button
                    type="button"
                    onClick={() => setShowNewProductForm(!showNewProductForm)}
                    className="absolute right-2 flex items-center justify-center p-2 rounded hover:bg-gray-200 transition-colors"
                    title="Ajouter un nouveau produit"
                >
                    <Plus size={20} className="text-gray-500" />
                </button>
            </div>

            {isDropdownOpen && (
                <ul className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg w-full max-h-40 overflow-y-auto">
                    {features.length > 0 ? (
                        features.map((feature) => (
                            <li
                                key={feature.id}
                                className="p-2 hover:bg-nextmux-green hover:text-white cursor-pointer"
                                onClick={() => handleSelect(feature)}
                            >
                                {feature.name} - {feature.price_with_content.toLocaleString()} XOF
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500 text-center">Aucune fonctionnalité disponible</li>
                    )}
                </ul>
            )}

            {showNewProductForm && (
                <div className="border p-4 mt-2 rounded bg-gray-50">
                    <h3 className="font-semibold mb-2">Ajouter un nouveau produit</h3>
                    <form onSubmit={handleAddNewProductSubmit} className="space-y-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={newProductData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={newProductData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (XOF)</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={newProductData.price_with_content}
                                onChange={(e) => handleInputChange('price_with_content', e.target.value)}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-2 p-2 bg-nextmux-green text-white rounded hover:bg-black"
                        >
                            Ajouter
                        </button>
                    </form>
                </div>
            )}

            {selectedFeature && (
                <div className="mt-2 p-2 border rounded bg-white shadow-sm">
                    <h4 className="font-semibold mb-1">Détails de la fonctionnalité sélectionnée</h4>
                    <p><strong>Description :</strong> {selectedFeature.description}</p>
                    <p><strong>Prix :</strong> {selectedFeature.price_with_content.toLocaleString()} XOF</p>
                </div>
            )}
        </div>
    );
};

export default CustomFeatureSelect;
