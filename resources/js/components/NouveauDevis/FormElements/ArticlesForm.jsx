// src/components/FormElements/ArticlesForm.jsx

import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import CustomProductSelect from '../CustomizeInputs/CustomProductSelect';

const ArticlesForm = ({ formData, handleItemChange, addItem, removeItem, setFormData }) => {
    // Liste des produits disponibles
    const products = [
        { id: 1, name: "Pack Site Vitrine", defaultQuantity: 1, unitPrice: 170000, tva: 20 },
        { id: 2, name: "Pack Site Institutionnel", defaultQuantity: 1, unitPrice: 245000, tva: 15 },
        { id: 3, name: "Pack Site E-commerce", defaultQuantity: 1, unitPrice: 475000, tva: 10 },
    ];

    // Fonction pour gérer les changements dans les articles
    const handleItemChangeLocal = (index, field, value) => {
        handleItemChange(index, field, value);
    };

    return (
        <div className="space-y-4 mb-16">
            {/* Liste des articles */}
            {formData.items.map((item, index) => (
                <div key={index} className="border p-4 rounded relative">
                    <button
                        onClick={() => removeItem(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                        <Trash2 size={20} />
                    </button>
                    <div className="grid gap-4">
                        {/* Sélection du produit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Produit</label>
                            <CustomProductSelect
                                index={index}
                                item={item}
                                onItemChange={handleItemChangeLocal}
                                products={products}
                            />
                        </div>

                        {/* Quantité */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                                <input
                                    type="number"
                                    value={item.quantite}
                                    onChange={(e) =>
                                        handleItemChangeLocal(index, "quantite", parseInt(e.target.value))
                                    }
                                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                                    min="1"
                                />
                            </div>

                            {/* Prix unitaire */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire</label>
                                <input
                                    type="number"
                                    value={item.prix}
                                    onChange={(e) =>
                                        handleItemChangeLocal(index, "prix", parseFloat(e.target.value))
                                    }
                                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                                    step="0.01"
                                    min="0"
                                />
                            </div>

                            {/* TVA (affiché uniquement si la case TVA est cochée) */}
                            {formData.include_tva && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">TVA (%)</label>
                                    <input
                                        type="number"
                                        value={item.tva}
                                        onChange={(e) =>
                                            handleItemChangeLocal(index, "tva", parseInt(e.target.value))
                                        }
                                        className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {/* Bouton pour ajouter un article */}
            <button
                onClick={addItem}
                className="w-full p-2 bg-nextmux-green text-white rounded-md hover:bg-black flex items-center justify-center"
            >
                <Plus size={20} className="mr-2" /> Ajouter un article
            </button>
        </div>
    );

};

export default ArticlesForm;
