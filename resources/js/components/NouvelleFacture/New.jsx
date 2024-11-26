import React, { useState } from 'react';
import { Download, Save, Share, Info } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalForm from './FormElements/GlobalForm';
import ClientForm from './FormElements/ClientForm';
import ArticlesForm from './FormElements/ArticlesForm';
import ConditionsForm from './FormElements/ConditionsForm';
import AperçuMobile from './FormElements/AperçuMobile';
import Sidebar from './Sidebar';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

const FactEditor = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState('general');
    const [formData, setFormData] = useState({
        numero: `12345`,
        date: new Date().toLocaleDateString('fr-CA'),
        emetteur: {
            nom: "",
            adresse: "",
            email: "",
            telephone: "",
        },
        client: {
            entreprise: "",
            email: "",
            telephone: "",
            adresse: "",
        },
        items: [
            {
                description: "",
                quantite: 1,
                prix: 0,
                tva: 20,
            },
        ],
        conditions: {
            paiement: "NextmuxPay",
            statut: "En cours", // Par défaut
            commentaires: "",
            signature: null,
        },
        includeTva: false,  // Ajout de l'état pour inclure la TVA
    });

    const handleSignatureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    conditions: {
                        ...prev.conditions,
                        signature: reader.result,
                    },
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
                    description: "",
                    quantite: 1,
                    prix: 0,
                    tva: 20,
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

    const calculateTotals = () => {
        const totalHT = formData.items.reduce((sum, item) =>
            sum + (item.quantite * item.prix), 0);
        let totalTVA = 0;
        if (formData.includeTva) {
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
        const previewElement = document.querySelector('.hidden.md\\:block.w-full.md\\:w-2\\/3 > div');

        if (!previewElement) {
            toast.error('Élément de prévisualisation non trouvé');
            return;
        }

        try {
            // Capture de l'élément en haute résolution
            const canvas = await html2canvas(previewElement, {
                scale: 3, // Augmente la qualité
                useCORS: true, // Pour gérer les images cross-origin
                logging: false, // Désactive les logs
                allowTaint: true,
                backgroundColor: null // Préserve la transparence
            });

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: imgWidth > imgHeight ? 'l' : 'p',
                unit: 'px',
                format: [imgWidth, imgHeight]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');

            pdf.save(`facture_${formData.numero}.pdf`);

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

    const handleSaveFact = () => {
        console.log("Facture enregistrée :", formData);
        toast.success('La facture a été sauvegardée avec succès !', {
            icon: '🎉',
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
        });
    };

    const handleShareFact = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Facture à partager',
                    text: 'Voici votre facture.',
                    url: window.location.href,
                });
                toast.success('Facture partagée avec succès !', {
                    icon: '🌟',
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
            } catch (error) {
                toast.error('Erreur lors du partage de la facture.', {
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
                    <div>
                        <GlobalForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            setFormData={setFormData}
                        />
                    </div>
                );
            case 'client':
                return (
                    <div className="space-y-4">
                        <ClientForm
                            formData={formData}
                            handleClientChange={handleClientChange}
                            setFormData={setFormData}
                        />
                    </div>
                );
            case 'articles':
                return (
                    <div className="space-y-4">
                        <ArticlesForm
                            formData={formData}
                            handleItemChange={handleItemChange}
                            addItem={addItem}
                            removeItem={removeItem}
                            setFormData={setFormData}
                        />
                    </div>
                );
            case 'conditions':
                return (
                    <ConditionsForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSignatureChange={handleSignatureChange}
                    />
                );
            case 'Aperçu':
                return (
                    <AperçuMobile
                        formData={formData}
                        calculateTotals={calculateTotals}
                        handleSaveFact={handleSaveFact}
                        handleShareFact={handleShareFact}
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
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onSave={handleSaveFact}
                onShare={handleShareFact}
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
                                'conditions': 'Conditions de paiement',
                                'Aperçu': 'Aperçu'
                            }[activeSection]
                        }
                    </h2>
                    {activeSection === 'Aperçu' ? (
                        <AperçuMobile
                            formData={formData}
                            calculateTotals={calculateTotals}
                            handleSaveFact={handleSaveFact}
                            handleShareFact={handleShareFact}
                        />
                    ) : renderFormSection()}
                </div>

                <div className="hidden md:block w-full md:w-2/3 bg-white p-8 overflow-y-auto overflow-x-hidden shadow-inner">
                    <div className="max-w-4xl mx-auto bg-white p-8 border rounded-lg relative hide-scrollbar">
                        {/* Filigrane en arrière-plan si le statut est défini */}
                        {formData.conditions.statut && (
                            <div
                                className={`absolute inset-0 flex justify-center items-center opacity-10 text-8xl font-bold uppercase transform rotate-[-30deg] pointer-events-none ${formData.conditions.statut === "Payé"
                                        ? "text-green-500"
                                        : formData.conditions.statut === "Impayé"
                                            ? "text-red-500"
                                            : "text-yellow-500"
                                    }`}
                            >
                                {formData.conditions.statut}
                            </div>
                        )}

                        {/* En-tête */}
                        <div className="flex justify-between items-start mb-8">
                            {/* Logo de l'entreprise (facultatif) */}
                            {formData.logo && (
                                <div className="w-48">
                                    <img src={formData.logo} alt="Logo entreprise" className="max-w-28 h-28" />
                                </div>
                            )}
                            {/* Informations de la facture */}
                            <div className="text-right flex-1">
                                <h1 className="text-2xl font-bold text-gray-800">FACTURE</h1>
                                <p className="text-gray-600">Facture N°#{formData.numero}</p>
                                <p className="text-gray-600">Date : {formData.date.split('-').reverse().join('/')}</p>
                            </div>
                        </div>

                        {/* Informations des deux parties */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Informations émetteur */}
                            <div className="border p-4 rounded-lg shadow-sm">
                                <h2 className="font-semibold mb-4 border-b pb-2 text-dtr-brown">ÉMETTEUR</h2>
                                <div className="pt-2">
                                    <p className="font-bold text-dtr-dark">{formData.emetteur.nom || "Nom de l'émetteur ou de l'entreprise"}</p>
                                    <p className="text-dtr-dark">{formData.emetteur.adresse}</p>
                                    <p className="text-dtr-dark">{formData.emetteur.email}</p>
                                    <p className="text-dtr-dark">{formData.emetteur.telephone}</p>
                                </div>
                            </div>

                            {/* Informations client */}
                            <div className="border p-4 rounded-lg shadow-sm">
                                <h2 className="font-semibold mb-4 border-b pb-2 text-dtr-brown">CLIENT</h2>
                                <div className="pt-2">
                                    <p className="font-bold text-dtr-dark">{formData.client.entreprise || 'À l’attention de'}</p>
                                    <p className="text-dtr-dark">{formData.client.nom}</p>
                                    <p className="text-dtr-dark">{formData.client.adresse}</p>
                                    <p className="text-dtr-dark">{formData.client.email}</p>
                                    <p className="text-dtr-dark">{formData.client.telephone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Articles */}
                        <table className="w-full mb-8">
                            <thead className="bg-gray-50">
                                <tr className="border-b">
                                    <th className="text-left p-2">Description</th>
                                    <th className="text-right p-2">Qté</th>
                                    <th className="text-right p-2">Prix unitaire</th>
                                    {formData.includeTva && <th className="text-right p-2">TVA</th>}
                                    <th className="text-right p-2">Total HT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">{item.description || ""}</td>
                                        <td className="text-right p-2">{item.quantite}</td>
                                        <td className="text-right p-2">{item.prix.toFixed(2)} XOF</td>
                                        {formData.includeTva && <td className="text-right p-2">{item.tva}%</td>}
                                        <td className="text-right p-2">{(item.quantite * item.prix).toFixed(2)} XOF</td>
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
                                {formData.includeTva && (
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

                        {/* Signature */}
                        <div className="pt-4 flex justify-end">
                            <div className="text-right">
                                <h3 className="font-semibold mb-2">Signature</h3>
                                {formData.conditions.signature && (
                                    <img
                                        src={formData.conditions.signature}
                                        alt="Signature numérique"
                                        className="mt-2 max-h-24 object-contain border border-gray-300 rounded-md"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-end space-x-2 mt-2">
                        <ToastContainer />
                        <button
                            onClick={handleSaveFact}
                            className="p-2 bg-nextmux-green text-white rounded-md hover:bg-black flex items-center justify-center"
                        >
                            <Save size={20} className="mr-1" />
                            Sauvegarder
                        </button>
                        <button
                            onClick={handleShareFact}
                            className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center"
                        >
                            <Share size={20} className="mr-1" />
                            Partager
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center"
                            title="Télécharger en PDF"
                        >
                            <Download size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FactEditor;
