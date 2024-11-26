import React from 'react';
import { Info } from 'lucide-react';
import CustomPaymentSelect from '../CustomizeInputs/CustomPaymentSelect';

const ConditionsForm = ({ formData, handleInputChange, handleSignatureChange }) => {
    const paymentOptions = ["NextmuxPay", "Stripe", "PayPal"];

    return (
        <div className="space-y-4 mb-16">
            {/* Mode de paiement */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
                <CustomPaymentSelect
                    value={formData.conditions.paiement}
                    onChange={(value) =>
                        handleInputChange("conditions", {
                            ...formData.conditions,
                            paiement: value,
                        })
                    }
                    options={paymentOptions}
                    placeholder="Mode de paiement"
                />
            </div>

            {/* Commentaires */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires</label>
                <textarea
                    value={formData.conditions.commentaires}
                    onChange={(e) =>
                        handleInputChange("conditions", {
                            ...formData.conditions,
                            commentaires: e.target.value,
                        })
                    }
                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green resize-y"
                    style={{
                        minHeight: "100px", // Hauteur minimale
                        maxHeight: "300px", // Hauteur maximale
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
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleSignatureChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {formData.conditions.signature ? (
                        <div className="flex flex-col items-center">
                            {/* Affiche l'image */}
                            <img
                                src={formData.conditions.signature} // Utilise la chaîne base64 comme source
                                alt="Signature numérique"
                                className="h-24 mb-2 object-contain"
                            />
                            <p className="text-sm text-gray-500">
                                Cliquez ou glissez-déposez pour modifier.
                            </p>
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
