// src/components/FormElements/ConditionsForm.jsx

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import CustomPaymentSelect from '../CustomizeInputs/CustomPaymentSelect';

const ConditionsForm = ({ formData, handleInputChange, handleSignatureChange }) => {
    const paymentOptions = ["NextmuxPay", "Stripe", "PayPal"];
    const [signature, setSignature] = useState(formData.conditions.signature || null);

    // Fonction pour gérer le changement de la signature
    const onSignatureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSignature(file);
            handleSignatureChange(file);
        }
    };

    const handleDropSignature = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            onSignatureChange({ target: { files: [file] } });
        }
    };

    const handleDragOverSignature = (e) => {
        e.preventDefault();
    };

    // Gestion du changement du mode de paiement avec log
    const handlePaiementChange = (value) => {
        console.log("Paiement sélectionné:", value); // Débogage
        handleInputChange("paiement", value);
    };

    // Gestion du changement des commentaires avec log
    const handleCommentairesChange = (e) => {
        const value = e.target.value;
        console.log("Commentaires saisis:", value); // Débogage
        handleInputChange("commentaires", value);
    };

    return (
        <div className="space-y-4 mb-16">
            {/* Mode de paiement */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
                <CustomPaymentSelect
                    value={formData.conditions.paiement}
                    onChange={handlePaiementChange}
                    options={paymentOptions}
                    placeholder="Mode de paiement"
                />
            </div>

            {/* Commentaires */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires</label>
                <textarea
                    value={formData.conditions.commentaires}
                    onChange={handleCommentairesChange}
                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green resize-y"
                    style={{
                        minHeight: "100px",
                        maxHeight: "300px",
                    }}
                    rows="4"
                    placeholder="Conditions ou informations complémentaires..."
                />
            </div>

            {/* Signature numérique */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signature Numérique
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
                <div
                    className="border-2 border-dashed rounded-lg p-4 text-center relative bg-gray-50"
                    onDrop={handleDropSignature}
                    onDragOver={handleDragOverSignature}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onSignatureChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {signature ? (
                        <div className="flex flex-col items-center">
                            <img
                                src={URL.createObjectURL(signature)}
                                alt="Signature numérique"
                                className="h-24 mb-2 object-contain"
                            />
                            <p className="text-sm text-gray-500">Cliquez ou glissez-déposez pour modifier.</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Glissez-déposez ou cliquez pour télécharger la signature numérique.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConditionsForm;
