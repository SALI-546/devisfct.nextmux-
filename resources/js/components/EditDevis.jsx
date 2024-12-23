// resources/js/components/EditDevis.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditDevis = ({ quote, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        numero: '',
        date_emission: '',
        include_tva: false,
        emetteur: {
            nom: '',
            adresse: '',
            email: '',
            telephone: '',
        },
        client: {
            entreprise: '',
            email: '',
            telephone: '',
            adresse: '',
        },
        paiement: '',
        commentaires: '',
        logo: null,
        signature: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (quote) {
            setFormData({
                numero: quote.numero || '',
                date_emission: quote.date_emission ? quote.date_emission.split('T')[0] : '',
                include_tva: quote.include_tva || false,
                emetteur: {
                    nom: quote.emetteur.nom || '',
                    adresse: quote.emetteur.adresse || '',
                    email: quote.emetteur.email || '',
                    telephone: quote.emetteur.telephone || '',
                },
                client: {
                    entreprise: quote.client.entreprise || '',
                    email: quote.client.email || '',
                    telephone: quote.client.telephone || '',
                    adresse: quote.client.adresse || '',
                },
                paiement: quote.paiement || '',
                commentaires: quote.commentaires || '',
                logo: null,
                signature: null,
            });
        }
    }, [quote]);

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleFileChange = (field, file) => {
        setFormData(prev => ({
            ...prev,
            [field]: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validation Côté Client
            const requiredFields = [
                'numero',
                'date_emission',
                'include_tva',
                'emetteur.nom',
                'emetteur.adresse',
                'emetteur.email',
                'emetteur.telephone',
                'client.entreprise',
                'client.email',
                'client.telephone',
                'client.adresse',
                'paiement'
            ];

            const isValid = requiredFields.every(field => {
                const keys = field.split('.');
                let value = formData;
                keys.forEach(key => {
                    value = value[key];
                });
                return value !== undefined && value !== null && value !== '';
            });

            if (!isValid) {
                toast.error('Veuillez remplir tous les champs requis.', {
                    icon: '⚠️',
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
                setIsSubmitting(false);
                return;
            }

            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(formData.client.email)) {
                toast.error('Veuillez entrer une adresse email valide pour le client.', {
                    icon: '⚠️',
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
                setIsSubmitting(false);
                return;
            }

            if (!emailRegex.test(formData.emetteur.email)) {
                toast.error('Veuillez entrer une adresse email valide pour l\'émetteur.', {
                    icon: '⚠️',
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
                setIsSubmitting(false);
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('numero', formData.numero);
            formDataToSend.append('date_emission', formData.date_emission);
            formDataToSend.append('include_tva', formData.include_tva ? '1' : '0');

            // Émetteur
            formDataToSend.append('emetteur[nom]', formData.emetteur.nom);
            formDataToSend.append('emetteur[adresse]', formData.emetteur.adresse);
            formDataToSend.append('emetteur[email]', formData.emetteur.email);
            formDataToSend.append('emetteur[telephone]', formData.emetteur.telephone);

            // Client
            formDataToSend.append('client[entreprise]', formData.client.entreprise);
            formDataToSend.append('client[email]', formData.client.email);
            formDataToSend.append('client[telephone]', formData.client.telephone);
            formDataToSend.append('client[adresse]', formData.client.adresse);

            // Conditions
            formDataToSend.append('paiement', formData.paiement);
            formDataToSend.append('commentaires', formData.commentaires);

            // Fichiers
            if (formData.logo) {
                formDataToSend.append('logo', formData.logo);
            }
            if (formData.signature) {
                formDataToSend.append('signature', formData.signature);
            }

            // Envoi de la requête de mise à jour
            const response = await axios.put(`/api/quotes/${quote.id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            console.log("Devis mis à jour:", response.data);
            onUpdate(response.data); // Mettre à jour le devis dans le parent
            toast.success("Devis mis à jour avec succès !");
            onClose(); // Fermer le modal
        } catch (error) {
            console.error('Erreur lors de la mise à jour du devis :', error);
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    toast.error(`${key}: ${errors[key].join(', ')}`, {
                        icon: '⚠️',
                        position: "bottom-left",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                    });
                });
            } else {
                toast.error('Erreur lors de la mise à jour du devis.', {
                    icon: '⚠️',
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Numéro du Devis</label>
                <input
                    type="text"
                    value={formData.numero}
                    onChange={(e) => handleChange('', 'numero', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Date d'Émission</label>
                <input
                    type="date"
                    value={formData.date_emission}
                    onChange={(e) => handleChange('', 'date_emission', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Inclure la TVA</label>
                <select
                    value={formData.include_tva ? '1' : '0'}
                    onChange={(e) => handleChange('', 'include_tva', e.target.value === '1')}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="1">Oui</option>
                    <option value="0">Non</option>
                </select>
            </div>

            {/* Émetteur */}
            <div className="border p-4 rounded">
                <h3 className="text-lg font-semibold mb-2">Émetteur</h3>
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nom de l'Émetteur</label>
                        <input
                            type="text"
                            value={formData.emetteur.nom}
                            onChange={(e) => handleChange('emetteur', 'nom', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Adresse</label>
                        <input
                            type="text"
                            value={formData.emetteur.adresse}
                            onChange={(e) => handleChange('emetteur', 'adresse', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={formData.emetteur.email}
                            onChange={(e) => handleChange('emetteur', 'email', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                        <input
                            type="tel"
                            value={formData.emetteur.telephone}
                            onChange={(e) => handleChange('emetteur', 'telephone', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Client */}
            <div className="border p-4 rounded">
                <h3 className="text-lg font-semibold mb-2">Client</h3>
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Entreprise</label>
                        <input
                            type="text"
                            value={formData.client.entreprise}
                            onChange={(e) => handleChange('client', 'entreprise', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={formData.client.email}
                            onChange={(e) => handleChange('client', 'email', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                        <input
                            type="tel"
                            value={formData.client.telephone}
                            onChange={(e) => handleChange('client', 'telephone', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Adresse</label>
                        <input
                            type="text"
                            value={formData.client.adresse}
                            onChange={(e) => handleChange('client', 'adresse', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Conditions */}
            <div className="border p-4 rounded">
                <h3 className="text-lg font-semibold mb-2">Conditions de Paiement</h3>
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mode de Paiement</label>
                        <input
                            type="text"
                            value={formData.paiement}
                            onChange={(e) => handleChange('', 'paiement', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Commentaires</label>
                        <textarea
                            value={formData.commentaires}
                            onChange={(e) => handleChange('', 'commentaires', e.target.value)}
                            className="w-full p-2 border rounded"
                            rows="3"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Logo (facultatif)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange('logo', e.target.files[0])}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Signature (facultatif)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange('signature', e.target.files[0])}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 flex items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Mise à jour...' : 'Mettre à Jour'}
                </button>
            </div>
        </form>
    );

};

export default EditDevis;
