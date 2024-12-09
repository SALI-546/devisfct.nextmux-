// src/components/FormElements/GlobalForm.jsx

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import CustomDatePicker from '../CustomizeInputs/CustomDatePicker';

const GlobalForm = ({ formData, handleInputChange, setFormData }) => {
    const [logo, setLogo] = useState(formData.logo || null);

    // Fonction pour gérer le changement du logo
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            setFormData((prevState) => ({
                ...prevState,
                logo: file,  // Sauvegarde le fichier du logo dans formData
            }));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleLogoChange({ target: { files: [file] } });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Gérer la case à cocher pour la TVA
    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            include_tva: e.target.checked,  // Utiliser 'include_tva' pour correspondre au backend
        });
    };

    return (
        <div className="space-y-4 mb-16">
            {/* Numéro de devis */}
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de devis
                    <span className="ml-2 relative" title='Voir les bonnes pratiques'>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-gray-500 w-4 h-4 cursor-pointer"
                        >
                            <Info size={20} />
                        </a>
                    </span>
                </label>
                <input
                    type="text"
                    value={formData.numero}
                    onChange={(e) => handleInputChange("numero", e.target.value)}
                    maxLength={45}
                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                />
            </div>

            {/* Date d'émission */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'émission</label>
                <CustomDatePicker
                    value={formData.date_emission} // Utiliser 'date_emission' pour correspondre au backend
                    onChange={(value) => handleInputChange("date_emission", value)}
                />
            </div>

            {/* Logo de l'entreprise */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo de l'entreprise</label>
                <div
                    className="border-2 border-dashed rounded-lg p-4 text-center relative bg-gray-50"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {logo ? (
                        <div className="flex flex-col items-center">
                            <img src={URL.createObjectURL(logo)} alt="Logo entreprise" className="h-24 mb-2 object-contain" />
                            <p className="text-sm text-gray-500">Cliquez ou glissez-déposez pour modifier.</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Glissez-déposez ou cliquez pour télécharger le logo de l'entreprise.
                        </p>
                    )}
                </div>
            </div>

            {/* Checkbox pour inclure la TVA */}
            <div className="flex items-center mt-4">
                <input
                    id="include_tvaCheckbox"
                    type="checkbox"
                    checked={formData.include_tva}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 border border-gray-300 rounded text-nextmux-green focus:ring-2 focus:ring-nextmux-green focus:ring-offset-2 accent-nextmux-green cursor-pointer"
                />
                <label
                    htmlFor="include_tvaCheckbox"
                    className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                >
                    Cochez cette case si vous souhaitez inclure la TVA
                </label>
            </div>
        </div>
    );

};

export default GlobalForm;
