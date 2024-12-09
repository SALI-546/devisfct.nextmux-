import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Save, Share } from 'lucide-react';

const AperçuMobile = ({ formData, calculateTotals, handleSaveDevis, handleShareDevis }) => {
    return (
        <div className="w-full mb-16">
            <div className="max-w-full mx-auto p-4 sm:p-8 border rounded-lg">
                {/* En-tête */}
                <div className="flex justify-between items-start mb-6">
                    {/* Logo de l'entreprise */}
                    {formData.logoFile && (
                        <div className="w-24 sm:w-32">
                            <img src={URL.createObjectURL(formData.logoFile)} alt="Logo entreprise" className="w-24 sm:w-28 h-24 object-contain" />
                        </div>
                    )}
                    {/* Informations du devis */}
                    <div className="text-right flex-1">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">DEVIS</h1>
                        <p className="text-sm sm:text-base text-gray-600">N° {formData.numero}</p>
                        <p className="text-sm sm:text-base text-gray-600">Date : {formData.date.split('-').reverse().join('/')}</p>
                    </div>
                </div>

                {/* Informations client */}
                <div className="mb-6">
                    <h2 className="font-semibold mb-2 border-b pb-2">CLIENT</h2>
                    <div className="pt-2">
                        <p className="font-bold">{formData.client.entreprise || 'Entreprise non renseignée'}</p>
                        <p>{formData.client.nom}</p>
                        <p>{formData.client.adresse}</p>
                        <p>{formData.client.email}</p>
                        <p>{formData.client.telephone}</p>
                    </div>
                </div>

                {/* Articles */}
                <table className="w-full mb-6">
                    <thead className="bg-gray-50">
                        <tr className="border-b">
                            <th className="text-left p-2 text-xs sm:text-sm">Description</th>
                            <th className="text-right p-2 text-xs sm:text-sm">Qté</th>
                            <th className="text-right p-2 text-xs sm:text-sm">Prix unitaire</th>
                            {formData.includeTva && <th className="text-right p-2 text-xs sm:text-sm">TVA</th>}
                            <th className="text-right p-2 text-xs sm:text-sm">Total HT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.items.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2 text-xs sm:text-sm">{item.description || ""}</td>
                                <td className="text-right p-2 text-xs sm:text-sm">{item.quantite}</td>
                                <td className="text-right p-2 text-xs sm:text-sm">{item.prix.toFixed(2)} XOF</td>
                                {formData.includeTva && <td className="text-right p-2 text-xs sm:text-sm">{item.tva}%</td>}
                                <td className="text-right p-2 text-xs sm:text-sm">
                                    {(item.quantite * item.prix).toFixed(2)} XOF
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totaux */}
                <div className="flex justify-end mb-6">
                    <div className="w-40 sm:w-64">
                        <div className="flex justify-between border-b py-2 text-xs sm:text-sm">
                            <span>Total HT</span>
                            <span>{calculateTotals().totalHT.toFixed(2)} XOF</span>
                        </div>
                        {formData.includeTva && (
                            <div className="flex justify-between border-b py-2 text-xs sm:text-sm">
                                <span>TVA</span>
                                <span>{calculateTotals().totalTVA.toFixed(2)} XOF</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold py-2 text-xs sm:text-sm">
                            <span>Total TTC</span>
                            <span>{calculateTotals().totalTTC.toFixed(2)} XOF</span>
                        </div>
                    </div>
                </div>

                {/* Conditions */}
                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Conditions de paiement</h3>
                    <p>Mode de paiement : {formData.conditions.paiement}</p>
                    {formData.conditions.commentaires && (
                        <p className="mt-2">{formData.conditions.commentaires}</p>
                    )}
                </div>
                <div className="pt-4 flex justify-end">
                    <div className="text-right">
                        <h3 className="font-semibold mb-2">Signature</h3>
                        {formData.conditions.signatureFile && (
                            <img
                                src={URL.createObjectURL(formData.conditions.signatureFile)}
                                alt="Signature numérique"
                                className="mt-2 max-h-24 object-contain border border-gray-300 rounded-md"
                            />
                        )}
                    </div>
                </div>
            </div>
            {/* Boutons d'action */}
            <ToastContainer />
            <div className="flex justify-end space-x-2 mt-2">
                <button
                    onClick={handleSaveDevis}
                    className="p-2 bg-nextmux-green text-white rounded-md hover:bg-black flex items-center justify-center text-xs sm:text-sm"
                >
                    <Save size={20} className="mr-1" />
                    Sauvegarder
                </button>
                <button
                    onClick={handleShareDevis}
                    className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center text-xs sm:text-sm"
                >
                    <Share size={20} className="mr-1" />
                    Partager
                </button>
            </div>
        </div>
    );

};

export default AperçuMobile;
