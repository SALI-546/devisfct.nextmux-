// resources/js/components/DevisEditor.jsx

import React, { useState } from 'react';
import { Download, Save, Share } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import GlobalForm from './FormElements/GlobalForm';
import ClientForm from './FormElements/ClientForm';
import ArticlesForm from './FormElements/ArticlesForm';
import ConditionsForm from './FormElements/ConditionsForm';
import AperçuMobile from './FormElements/AperçuMobile';
import Sidebar from './Sidebar';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

const DevisEditor = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [formData, setFormData] = useState({
        numero: `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date_emission: new Date().toISOString().split('T')[0],
        include_tva: false,
        client: {
            entreprise: "",
            nom: "",
            email: "",
            telephone: "",
            adresse: "",
            // Supprimer 'user_id'
        },
        items: [
            {
                product_id: '',
                quantite: 1,
                prix: 0,
                tva: 20,
            },
        ],
        conditions: {
            paiement: "", // Initialiser à une chaîne vide
            commentaires: "",
            signature: null,
        },
        logo: null,
    });
    const [quoteId, setQuoteId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Gestion des changements pour la signature
    const handleSignatureChange = (file) => {
        setFormData(prev => ({
            ...prev,
            conditions: {
                ...prev.conditions,
                signature: file,
            },
        }));
    };

    // Fonction dédiée pour mettre à jour les conditions
    const handleConditionsChange = (field, value) => {
        console.log(`Updating conditions.${field} to:`, value); // Débogage
        setFormData(prev => ({
            ...prev,
            conditions: {
                ...prev.conditions,
                [field]: value,
            }
        }));
    };

    // Gestion des changements généraux
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Gestion des changements spécifiques au client
    const handleClientChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            client: { ...prev.client, [field]: value },
        }));
    };

    // Gestion des changements des articles
    const handleItemChange = (index, field, value) => {
        setFormData(prev => {
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    // Ajouter un nouvel article
    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    product_id: '',
                    quantite: 1,
                    prix: 0,
                    tva: 20,
                },
            ],
        }));
    };

    // Supprimer un article existant
    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    // Calcul des totaux
    const calculateTotals = () => {
        const totalHT = formData.items.reduce((sum, item) =>
            sum + (item.quantite * item.prix), 0);
        let totalTVA = 0;
        if (formData.include_tva) {
            totalTVA = formData.items.reduce((sum, item) =>
                sum + (item.quantite * item.prix * (item.tva / 100)), 0);
        }
        return {
            totalHT,
            totalTVA,
            totalTTC: totalHT + totalTVA
        };
    };

    // Fonction pour générer le PDF
    const handleDownloadPDF = async () => {
        const previewElement = document.querySelector('.preview-container');

        if (!previewElement) {
            toast.error('Élément de prévisualisation non trouvé');
            return;
        }

        try {
            // Capture de l'élément en haute résolution
            const canvas = await html2canvas(previewElement, {
                scale: 3,
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: null
            });

            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'l' : 'p',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height, '', 'FAST');

            pdf.save(`devis_${formData.numero}.pdf`);

        } catch (error) {
            console.error('Erreur lors de la génération du PDF :', error);
            toast.error('Impossible de générer le PDF', {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
            });
        }
    };

    /**
     * Fonction pour sauvegarder le devis via l'API.
     */
    const handleSaveDevis = async () => {
        setIsLoading(true);
        try {
            // Valider que tous les champs requis sont remplis
            if (
                !formData.numero ||
                !formData.date_emission ||
                formData.include_tva === null ||
                !formData.client.entreprise ||
                !formData.client.nom ||
                !formData.client.email ||
                !formData.client.telephone ||
                !formData.client.adresse ||
                !formData.conditions.paiement // S'assurer que 'paiement' est rempli
            ) {
                toast.error('Veuillez remplir tous les champs requis.', {
                    icon: '⚠️',
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
                setIsLoading(false);
                return;
            }

            // Vérifiez si l'email est valide
            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(formData.client.email)) {
                toast.error('Veuillez entrer une adresse email valide.', {
                    icon: '⚠️',
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
                setIsLoading(false);
                return;
            }

            // **Débogage : Afficher les données avant l'envoi**
            console.log("FormData avant envoi:", formData);

            // **Étape 1 : Créer le devis avec les conditions**
            const formDataToSend = new FormData();
            formDataToSend.append('numero', formData.numero);
            formDataToSend.append('date_emission', formData.date_emission);
            formDataToSend.append('include_tva', formData.include_tva ? '1' : '0');
            // Append client data
            formDataToSend.append('client[entreprise]', formData.client.entreprise);
            formDataToSend.append('client[nom]', formData.client.nom);
            formDataToSend.append('client[email]', formData.client.email);
            formDataToSend.append('client[telephone]', formData.client.telephone);
            formDataToSend.append('client[adresse]', formData.client.adresse);
            // Ne plus envoyer 'client[user_id]'
            // Append logo if exists
            if (formData.logo) {
                formDataToSend.append('logo', formData.logo);
            }
            // Append conditions
            formDataToSend.append('paiement', formData.conditions.paiement);
            formDataToSend.append('commentaires', formData.conditions.commentaires);
            if (formData.conditions.signature) {
                formDataToSend.append('signature', formData.conditions.signature);
            }

            // **Débogage : Afficher les données envoyées pour la création du devis avec conditions**
            console.log("Envoi des données de création du devis avec conditions:");
            for (let pair of formDataToSend.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            // Créer le devis via l'API
            const quoteResponse = await axios.post('/api/quotes', formDataToSend, {
                // Assurez-vous que les cookies sont envoyés si vous utilisez l'authentification de session
                withCredentials: true,
            });

            console.log("Devis créé avec l'ID:", quoteResponse.data.id);
            const createdQuoteId = quoteResponse.data.id;
            setQuoteId(createdQuoteId);

            // **Étape 2 : Mettre à jour les articles**
            if (formData.items.length > 0) {
                // Log les données des articles
                console.log("Envoi des données des articles:", formData.items);

                const itemsResponse = await axios.patch(`/api/quotes/${createdQuoteId}/items`, { items: formData.items }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // Si nécessaire
                });

                // Log la réponse des articles
                console.log("Réponse des articles:", itemsResponse.data);
            }

            // **Redirection vers la visualisation du devis**
            window.location.href = `/devis/${createdQuoteId}`; // Redirection après la soumission

            toast.success('Le devis a été enregistré avec succès !', {
                icon: '🎉',
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
            });

        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du devis :', error);
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
            } else if (error.response && error.response.status === 404) {
                toast.error('Devis non trouvé (404).', {
                    icon: '⚠️',
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
            } else {
                toast.error('Erreur lors de l\'enregistrement du devis.', {
                    icon: '⚠️',
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleShareDevis = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Devis à partager',
                    text: 'Voici le devis que vous m’avez demandé.',
                    url: window.location.href,
                });
                toast.success('Devis partagé avec succès !', {
                    icon: '🌟',
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
            } catch (error) {
                toast.error('Erreur lors du partage du devis.', {
                    icon: '⚠️',
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
            }
        } else {
            toast.error("Le partage n'est pas supporté sur ce navigateur.", {
                icon: '⚠️',
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
            });
        }
    };

    const renderFormSection = () => {
        switch (activeSection) {
            case 'general':
                return (
                    <GlobalForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        setFormData={setFormData}
                    />
                );
            case 'client':
                return (
                    <ClientForm
                        formData={formData}
                        handleClientChange={handleClientChange}
                        setFormData={setFormData}
                    />
                );
            case 'articles':
                return (
                    <ArticlesForm
                        formData={formData}
                        handleItemChange={handleItemChange}
                        addItem={addItem}
                        removeItem={removeItem}
                        setFormData={setFormData}
                    />
                );
            case 'conditions':
                return (
                    <ConditionsForm
                        formData={formData}
                        handleInputChange={handleConditionsChange} // Utiliser la fonction dédiée
                        handleSignatureChange={handleSignatureChange}
                    />
                );
            case 'Aperçu':
                return (
                    <AperçuMobile
                        formData={formData}
                        calculateTotals={calculateTotals}
                        handleSaveDevis={handleSaveDevis}
                        handleShareDevis={handleShareDevis}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            {/* Contenu principal */}
            <div className="flex flex-1 flex-col md:flex-row">
                {/* Formulaire */}
                <div className="w-full md:w-1/3 p-6 bg-gray-50 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        {
                            {
                                'general': 'Informations générales',
                                'client': 'Détails du client',
                                'articles': 'Gestion des articles',
                                'conditions': 'Conditions du devis',
                                'Aperçu': 'Aperçu'
                            }[activeSection]
                        }
                    </h2>
                    {renderFormSection()}
                </div>

                {/* Prévisualisation - visible uniquement sur desktop */}
                <div className="hidden md:block w-full md:w-2/3 bg-white p-8 overflow-y-auto shadow-inner">
                    <div className="max-w-4xl mx-auto bg-white p-8 border rounded-lg preview-container">
                        {/* En-tête */}
                        <div className="flex justify-between items-start mb-8">
                            {/* Logo de l'entreprise (facultatif) */}
                            {formData.logo && (
                                <div className="w-48">
                                    <img src={URL.createObjectURL(formData.logo)} alt="Logo entreprise" className="max-w-28 h-28 object-contain" />
                                </div>
                            )}
                            {/* Informations du devis */}
                            <div className="text-right flex-1">
                                <h1 className="text-2xl font-bold text-gray-800">DEVIS</h1>
                                <p className="text-gray-600">N° {formData.numero}</p>
                                <p className="text-gray-600">Date : {formData.date_emission.split('-').reverse().join('/')}</p>
                            </div>
                        </div>

                        {/* Informations client */}
                        <div className="mb-8">
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
                        <table className="w-full mb-8">
                            <thead className="bg-gray-50">
                                <tr className="border-b">
                                    <th className="text-left p-2">Produit</th>
                                    <th className="text-right p-2">Qté</th>
                                    <th className="text-right p-2">Prix unitaire</th>
                                    {formData.include_tva && <th className="text-right p-2">TVA</th>}
                                    <th className="text-right p-2">Total HT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">{getProductName(item.product_id) || ""}</td>
                                        <td className="text-right p-2">{item.quantite}</td>
                                        <td className="text-right p-2">{item.prix.toFixed(2)} XOF</td>
                                        {formData.include_tva && <td className="text-right p-2">{item.tva}%</td>}
                                        <td className="text-right p-2">
                                            {(item.quantite * item.prix).toFixed(2)} XOF
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totaux */}
                        <div className="flex justify-end mb-8">
                            <div className="w-64">
                                <div className="flex justify-between border-b py-2">
                                    <span>Total HT</span>
                                    <span>{calculateTotals().totalHT.toFixed(2)} XOF</span>
                                </div>
                                {formData.include_tva && (
                                    <div className="flex justify-between border-b py-2">
                                        <span>TVA</span>
                                        <span>{calculateTotals().totalTVA.toFixed(2)} XOF</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold py-2">
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
                                {formData.conditions.signature && (
                                    <img
                                        src={URL.createObjectURL(formData.conditions.signature)}
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
                            disabled={isLoading}
                            className={`p-2 bg-nextmux-green text-white rounded-md hover:bg-black flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Sauvegarde...' : (
                                <>
                                    <Save size={20} className="mr-1" />
                                    Sauvegarder
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleShareDevis}
                            className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center"
                        >
                            <Share size={20} className="mr-1" />
                            Partager
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center"
                            title='Télécharger en PDF'
                        >
                            <Download size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    };
    
    // Helper function to get product name by id
    const getProductName = (productId) => {
        const product = [
            { id: 1, name: "Pack Site Vitrine" },
            { id: 2, name: "Pack Site Institutionnel" },
            { id: 3, name: "Pack Site E-commerce" },
        ].find(p => p.id === productId);
        return product ? product.name : '';
    };

    export default DevisEditor;
