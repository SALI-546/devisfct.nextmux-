// resources/js/components/DevisEditor.jsx

import React, { useState, useEffect } from 'react';
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
    const [packs, setPacks] = useState([]);
    const [formData, setFormData] = useState({
        numero: `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date_emission: new Date().toISOString().split('T')[0],
        include_tva: false,
        emetteur: { // Ajout de l'émetteur
            nom: "",
            adresse: "",
            email: "",
            telephone: "",
        },
        client: {
            entreprise: "",
            // Suppression de 'nom' dans formData
            email: "",
            telephone: "",
            adresse: "",
        },
        items: [
            {
                pack_id: '',
                product_id: '',
                quantite: 1,
                prix: 0,
                tva: 0,
                is_new_product: false,
                new_product_name: '',
                new_product_description: '',
                new_product_price: 0,
            },
        ],
        conditions: {
            paiement: "",
            commentaires: "",
            signature: null,
        },
        logo: null,
    });
    const [quoteId, setQuoteId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Récupération des packs
    useEffect(() => {
        const fetchPacks = async () => {
            try {
                const response = await axios.get('/api/products', { withCredentials: true });
                setPacks(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des packs:', error);
                toast.error('Erreur lors de la récupération des packs.', {
                    icon: '⚠️',
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
            }
        };
        fetchPacks();
    }, []);

    const handleSignatureChange = (file) => {
        setFormData(prev => ({
            ...prev,
            conditions: {
                ...prev.conditions,
                signature: file,
            },
        }));
    };

    const handleConditionsChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            conditions: {
                ...prev.conditions,
                [field]: value,
            }
        }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEmetteurChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            emetteur: { ...prev.emetteur, [field]: value },
        }));
    };

    const handleClientChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            client: { ...prev.client, [field]: value },
        }));
    };

    const handleItemChange = (index, field, value) => {
        setFormData(prev => {
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    pack_id: '',
                    product_id: '',
                    quantite: 1,
                    prix: 0,
                    tva: 0,
                    is_new_product: false,
                    new_product_name: '',
                    new_product_description: '',
                    new_product_price: 0,
                },
            ],
        }));
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleAddNewProduct = (packId, newProduct) => {
        setPacks(prevPacks => {
            return prevPacks.map(p => {
                if (p.id === packId) {
                    return {
                        ...p,
                        features: [...p.features, newProduct],
                    };
                }
                return p;
            });
        });
    };

    const calculateTotals = () => {
        const totalHT = formData.items.reduce((sum, item) =>
            sum + (item.quantite * item.prix), 0);
        let totalTVA = 0;
        if (formData.include_tva) {
            formData.items.forEach(item => {
                const tvaRate = item.tva || 0;
                totalTVA += item.quantite * item.prix * (tvaRate / 100);
            });
        }
        return {
            totalHT,
            totalTVA,
            totalTTC: totalHT + totalTVA
        };
    };

    const handleDownloadPDF = async () => {
        const previewElement = document.querySelector('.preview-container');
        if (!previewElement) {
            toast.error('Élément de prévisualisation non trouvé');
            return;
        }

        try {
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

    const handleSaveDevis = async () => {
        setIsLoading(true);
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
                // Suppression de 'client.nom' de la validation
                'client.email',
                'client.telephone',
                'client.adresse',
                'conditions.paiement'
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
                setIsLoading(false);
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
                setIsLoading(false);
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
                setIsLoading(false);
                return;
            }

            console.log("FormData avant envoi:", formData);

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
            // Suppression de 'client.nom'
            formDataToSend.append('client[email]', formData.client.email);
            formDataToSend.append('client[telephone]', formData.client.telephone);
            formDataToSend.append('client[adresse]', formData.client.adresse);

            if (formData.logo) {
                formDataToSend.append('logo', formData.logo);
            }

            formDataToSend.append('paiement', formData.conditions.paiement);
            formDataToSend.append('commentaires', formData.conditions.commentaires);
            if (formData.conditions.signature) {
                formDataToSend.append('signature', formData.conditions.signature);
            }

            console.log("Envoi des données de création du devis avec conditions et émetteur:");
            for (let pair of formDataToSend.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            // Création du devis
            const quoteResponse = await axios.post('/api/quotes', formDataToSend, {
                withCredentials: true,
            });

            console.log("Devis créé avec l'ID:", quoteResponse.data.id);
            const createdQuoteId = quoteResponse.data.id;
            setQuoteId(createdQuoteId);

            if (formData.items.length > 0) {
                // Inclure les informations du nouveau produit si is_new_product est true
                const itemsToSend = formData.items.map(item => {
                    const newItem = {
                        product_id: item.product_id,
                        quantite: item.quantite,
                        tva: item.tva || 0,
                        prix: item.prix
                    };
                    // Si c'est un nouveau produit
                    if (item.is_new_product) {
                        newItem.is_new_product = true;
                        newItem.new_product_name = item.new_product_name;
                        newItem.new_product_description = item.new_product_description || '';
                        newItem.new_product_price = item.new_product_price;
                        newItem.pack_id = item.pack_id; 
                    }
                    return newItem;
                });

                console.log("Envoi des données des articles:", itemsToSend);

                const itemsResponse = await axios.patch(`/api/quotes/${createdQuoteId}/items`, { items: itemsToSend }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                console.log("Réponse des articles:", itemsResponse.data);
            }

            window.location.href = `/devis/${createdQuoteId}`;

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
                        handleEmetteurChange={handleEmetteurChange} // Passer handleEmetteurChange
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
                        packs={packs}
                        onAddNewProduct={handleAddNewProduct}
                    />
                );
            case 'conditions':
                return (
                    <ConditionsForm
                        formData={formData}
                        handleInputChange={handleConditionsChange}
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

    const getProductDetails = (productId, packs) => {
        for (let pack of packs) {
            const feature = pack.features.find(f => f.id === productId);
            if (feature) {
                return feature;
            }
        }
        return null;
    };

    const totals = calculateTotals();

    return (
        <div className="flex h-screen">
            <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            <div className="flex flex-1 flex-col md:flex-row">
                <div className="w-full md:w-1/3 p-6 bg-gray-50 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        {
                            {
                                'general': 'Informations générales',
                                'client': 'Détails du client et Émetteur',
                                'articles': 'Gestion des articles',
                                'conditions': 'Conditions du devis',
                                'Aperçu': 'Aperçu'
                            }[activeSection]
                        }
                    </h2>
                    {renderFormSection()}
                </div>

                <div className="hidden md:block w-full md:w-2/3 bg-white p-8 overflow-y-auto shadow-inner">
                    <div className="max-w-4xl mx-auto bg-white p-8 border rounded-lg preview-container">
                        <div className="flex justify-between items-start mb-8">
                            {formData.logo && (
                                <div className="w-48">
                                    <img src={URL.createObjectURL(formData.logo)} alt="Logo entreprise" className="max-w-28 h-28 object-contain" />
                                </div>
                            )}
                            <div className="text-right flex-1">
                                <h1 className="text-2xl font-bold text-gray-800">DEVIS</h1>
                                <p className="text-gray-600">N° {formData.numero}</p>
                                <p className="text-gray-600">Date : {formData.date_emission.split('-').reverse().join('/')}</p>
                            </div>
                        </div>

                        {/* Émetteur */}
                        <div className="mb-8">
                            <h2 className="font-semibold mb-2 border-b pb-2">ÉMETTEUR</h2>
                            <div className="pt-2">
                                <p className="font-bold">{formData.emetteur.nom || 'Nom de l\'émetteur ou de l\'entreprise'}</p>
                                <p>{formData.emetteur.adresse}</p>
                                <p>{formData.emetteur.email}</p>
                                <p>{formData.emetteur.telephone}</p>
                            </div>
                        </div>

                        {/* Client */}
                        <div className="mb-8">
                            <h2 className="font-semibold mb-2 border-b pb-2">CLIENT</h2>
                            <div className="pt-2">
                                <p className="font-bold">{formData.client.entreprise || 'Entreprise non renseignée'}</p>
                                {/* Suppression de l'affichage de 'client.nom' */}
                                <p>{formData.client.adresse}</p>
                                <p>{formData.client.email}</p>
                                <p>{formData.client.telephone}</p>
                            </div>
                        </div>

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
                                {formData.items.map((item, index) => {
                                    const productDetails = getProductDetails(item.product_id, packs);
                                    return (
                                        <tr key={index} className="border-b">
                                            <td className="p-2">
                                                {productDetails ? (
                                                    <>
                                                        <div className="font-semibold">{productDetails.name}</div>
                                                        <div className="text-sm text-gray-500">{productDetails.description}</div>
                                                    </>
                                                ) : ''}
                                            </td>
                                            <td className="text-right p-2">{item.quantite}</td>
                                            <td className="text-right p-2">{item.prix.toFixed(2)} XOF</td>
                                            {formData.include_tva && <td className="text-right p-2">{item.tva || 0}%</td>}
                                            <td className="text-right p-2">
                                                {(item.quantite * item.prix).toFixed(2)} XOF
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="flex justify-end mb-8">
                            <div className="w-64">
                                <div className="flex justify-between border-b py-2">
                                    <span>Total HT</span>
                                    <span>{totals.totalHT.toFixed(2)} XOF</span>
                                </div>
                                {formData.include_tva && (
                                    <div className="flex justify-between border-b py-2">
                                        <span>TVA</span>
                                        <span>{totals.totalTVA.toFixed(2)} XOF</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold py-2">
                                    <span>Total TTC</span>
                                    <span>{totals.totalTTC.toFixed(2)} XOF</span>
                                </div>
                            </div>
                        </div>

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

    export default DevisEditor;
