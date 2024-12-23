import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import CustomPackSelect from '../CustomizeInputs/CustomPackSelect';
import CustomFeatureSelect from '../CustomizeInputs/CustomFeatureSelect';

const ArticlesForm = ({ formData, handleItemChange, addItem, removeItem, setFormData, packs, onAddNewProduct }) => {
    const handleItemChangeLocal = (index, field, value) => {
        handleItemChange(index, field, value);
    };

    return (
        <div className="space-y-4 mb-16">
            {formData.items.map((item, index) => (
                <div key={index} className="border p-4 rounded relative">
                    <button
                        onClick={() => removeItem(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                        <Trash2 size={20} />
                    </button>
                    <div className="grid gap-4">
                        {/* Sélection du pack */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pack</label>
                            <CustomPackSelect
                                index={index}
                                item={item}
                                onItemChange={handleItemChangeLocal}
                                packs={packs}
                            />
                        </div>

                        {/* Sélection de la fonctionnalité */}
                        {item.pack_id && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fonctionnalité</label>
                                <CustomFeatureSelect
                                    index={index}
                                    item={item}
                                    onItemChange={handleItemChangeLocal}
                                    packs={packs}
                                    onAddNewProduct={onAddNewProduct}
                                />
                            </div>
                        )}

                        {/* Quantité, Prix, TVA */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                                <input
                                    type="number"
                                    value={item.quantite}
                                    onChange={(e) => handleItemChangeLocal(index, "quantite", parseInt(e.target.value))}
                                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire (XOF)</label>
                                <input
                                    type="number"
                                    value={item.prix}
                                    onChange={(e) => handleItemChangeLocal(index, "prix", parseFloat(e.target.value))}
                                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                                    step="0.01"
                                    min="0"
                                />
                            </div>

                            {formData.includeTva && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">TVA (%)</label>
                                    <input
                                        type="number"
                                        value={item.tva || 0}
                                        onChange={(e) => handleItemChangeLocal(index, "tva", parseInt(e.target.value))}
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
