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

const FactEditor = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState('general');
    const [invoiceId, setInvoiceId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [packs, setPacks] = useState([]);
    const [logo, setLogo] = useState(null);
    const [signature, setSignature] = useState(null);
    const [signatureUrl, setSignatureUrl] = useState(null);

    const getInvoiceIdFromURL = () => {
        const pathParts = window.location.pathname.split('/');
        const maybeId = pathParts[pathParts.length - 2];
        return isNaN(maybeId) ? null : maybeId;
    };

    const initialFormData = {
        numero: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
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
                is_new_product: false,
                new_product_name: '',
                new_product_description: '',
                new_product_price: 0,
                product_id: '',
                pack_id: '',
            },
        ],
        conditions: {
            paiement: "NextmuxPay",
            statut: "En cours",
            commentaires: "",
            signature: null,
        },
        logo: null,
        includeTva: false,
        due_date: null,
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        const id = getInvoiceIdFromURL();
        setInvoiceId(id);

        axios.get('/api/products', { withCredentials: true })
            .then(res => setPacks(res.data))
            .catch(err => console.error('Erreur lors du chargement des packs:', err));

        if (id) {
            setLoading(true);
            axios.get(`/api/invoices/${id}`, { withCredentials: true })
                .then((res) => {
                    const invoice = res.data;
                    const transformedData = invoiceToFormData(invoice);
                    setFormData(transformedData);
                    setSignatureUrl(transformedData.conditions.signature);
                })
                .catch((err) => {
                    console.error("Erreur lors du chargement de la facture :", err);
                    toast.error('Impossible de charger la facture.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, []);

    const invoiceToFormData = (invoice) => {
        return {
            numero: invoice.numero,
            date: invoice.date_emission ? invoice.date_emission.split('T')[0] : new Date().toLocaleDateString('fr-CA'),
            emetteur: {
                nom: invoice.emetteur ? invoice.emetteur.nom : "",
                adresse: invoice.emetteur ? invoice.emetteur.adresse : "",
                email: invoice.emetteur ? invoice.emetteur.email : "",
                telephone: invoice.emetteur ? invoice.emetteur.telephone : "",
            },
            client: {
                entreprise: invoice.client.entreprise,
                email: invoice.client.email,
                telephone: invoice.client.telephone,
                adresse: invoice.client.adresse,
            },
            items: invoice.items.map(item => ({
                description: item.description || "",
                quantite: item.quantite,
                prix: item.prix,
                tva: item.tva,
                is_new_product: false,
                new_product_name: '',
                new_product_description: '',
                new_product_price: 0,
                product_id: item.product_id || '',
                pack_id: item.product && item.product.parent_id ? item.product.parent_id : '',
            })),
            conditions: {
                paiement: invoice.paiement,
                statut: invoice.statut === 'Brouillon' ? 'En cours' : invoice.statut,
                commentaires: invoice.commentaires || "",
                signature: invoice.signature_url || null, // Utilisation de signature_url
            },
            logo: invoice.logo_url || null, // Utilisation de logo_url directement
            includeTva: !!invoice.include_tva,
            due_date: invoice.due_date ? invoice.due_date.split('T')[0] : null,
        };
    };

    const formDataToApiPayload = (data) => {
        const formDataPayload = new FormData();

        formDataPayload.append('numero', data.numero);
        formDataPayload.append('date_emission', data.date);
        
        // Convertir includeTva en entier
        formDataPayload.append('include_tva', data.includeTva ? 1 : 0);
        
        formDataPayload.append('paiement', data.conditions.paiement);
        formDataPayload.append('commentaires', data.conditions.commentaires);
        formDataPayload.append('statut', data.conditions.statut === 'En cours' ? 'Brouillon' : data.conditions.statut);
        
        // Gérer due_date correctement (n'envoyer que si défini)
        if (data.due_date) {
            formDataPayload.append('due_date', data.due_date);
        }

        formDataPayload.append('emetteur[nom]', data.emetteur.nom);
        formDataPayload.append('emetteur[adresse]', data.emetteur.adresse);
        formDataPayload.append('emetteur[email]', data.emetteur.email);
        formDataPayload.append('emetteur[telephone]', data.emetteur.telephone);
        formDataPayload.append('client[entreprise]', data.client.entreprise);
        formDataPayload.append('client[email]', data.client.email);
        formDataPayload.append('client[telephone]', data.client.telephone);
        formDataPayload.append('client[adresse]', data.client.adresse);

        data.items.forEach((item, index) => {
            formDataPayload.append(`items[${index}][description]`, item.description);
            formDataPayload.append(`items[${index}][quantite]`, item.quantite);
            formDataPayload.append(`items[${index}][prix]`, item.prix);
            formDataPayload.append(`items[${index}][tva]`, item.tva);
            formDataPayload.append(`items[${index}][is_new_product]`, item.is_new_product);
            formDataPayload.append(`items[${index}][new_product_name]`, item.new_product_name);
            formDataPayload.append(`items[${index}][new_product_description]`, item.new_product_description);
            formDataPayload.append(`items[${index}][new_product_price]`, item.new_product_price);
            formDataPayload.append(`items[${index}][product_id]`, item.product_id);
        });

        if (logo) {
            formDataPayload.append('logo', logo);
        }
        if (signature) {
            formDataPayload.append('signature', signature);
        }
        return formDataPayload;
    };


    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    logo: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSignatureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSignature(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSignatureUrl(reader.result)
                setFormData(prev => ({
                    ...prev,
                    conditions: {
                        ...prev.conditions,
                        signature: reader.result
                    }
                }))
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEmetteurChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            emetteur: { ...prev.emetteur, [field]: value },
        }));
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
        setFormData((prev) => {
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            if (field === "product_id" && value) {
                const selectedPack = packs.find((pack) => pack.id === newItems[index].pack_id);
                const selectedFeature = selectedPack
                    ? selectedPack.features.find((feature) => feature.id === value)
                    : null;
                if (selectedFeature) {
                    newItems[index].description = selectedFeature.description || "";
                    newItems[index].prix = selectedFeature.price_with_content || 0;
                }
            }
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
                    is_new_product: false,
                    new_product_name: '',
                    new_product_description: '',
                    new_product_price: 0,
                    product_id: '',
                    pack_id: '',
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
        const totalHT = formData.items.reduce((sum, item) => sum + (item.quantite * item.prix), 0);
        let totalTVA = 0;
        if (formData.includeTva) {
            totalTVA = formData.items.reduce((sum, item) => sum + (item.quantite * item.prix * (item.tva / 100)), 0);
        }
        return { totalHT, totalTVA, totalTTC: totalHT + totalTVA };
    };

    const handleDownloadPDF = async () => {
        const previewElement = document.querySelector('.hidden.md\\:block.w-full.md\\:w-2\\/3 > div');
        if (!previewElement) {
            toast.error('Élément de prévisualisation non trouvé');
            return;
        }
        try {
            const canvas = await html2canvas(previewElement, { scale: 3, useCORS: true, logging: false, allowTaint: true, backgroundColor: null });
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: imgWidth > imgHeight ? 'l' : 'p', unit: 'px', format: [imgWidth, imgHeight] });
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');
            pdf.save(`facture_${formData.numero}.pdf`);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF :', error);
            toast.error('Impossible de générer le PDF', { position: "bottom-left", autoClose: 3000, hideProgressBar: true, closeOnClick: true });
        }
    };

    const handleSaveFact = async () => {
        setIsSaving(true);
        try {
            const payload = formDataToApiPayload(formData);
            let response;
            if (invoiceId) {
                response = await axios.put(`/api/invoices/${invoiceId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
            } else {
                response = await axios.post('/api/invoices', payload, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
                const newInvoiceId = response.data.id;
                window.location.href = `/facture/${newInvoiceId}/edit`;
            }
            toast.success('La facture a été sauvegardée avec succès !', { icon: '🎉', position: "bottom-left", autoClose: 3000, hideProgressBar: true, closeOnClick: true });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la facture :', error.response || error);
            if (error.response && error.response.data && error.response.data.errors) {
                // Afficher les erreurs de validation détaillées
                toast.error(`Erreur : ${Object.values(error.response.data.errors).flat().join(", ")}`, { icon: '⚠️', position: "bottom-left", autoClose: 3000, hideProgressBar: true, closeOnClick: true });
            }
            else {
                toast.error('Impossible de sauvegarder la facture.', { icon: '⚠️', position: "bottom-left", autoClose: 3000, hideProgressBar: true, closeOnClick: true });
            }
        } finally {
            setIsSaving(false);
        }
    };


    const handleShareFact = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Facture à partager', text: 'Voici votre facture.', url: window.location.href });
                toast.success('Facture partagée avec succès !', { icon: '🌟', position: "bottom-left", autoClose: 3000, hideProgressBar: true, closeOnClick: true });
            } catch (error) {
                toast.error('Erreur lors du partage de la facture.', { icon: '⚠️', position: "bottom-left", autoClose: 3000, hideProgressBar: true, closeOnClick: true });
            }
        } else {
            toast.error("Le partage n'est pas supporté sur ce navigateur.", { icon: '⚠️', position: "bottom-left", autoClose: 3000, hideProgressBar: true, closeOnClick: true });
        }
    };

    const onAddNewProduct = (packId, newFeature) => {
        setPacks(prevPacks => prevPacks.map(p => p.id === packId ? { ...p, features: [...p.features, newFeature] } : p));
    };

    const renderFormSection = () => {
        if (loading) {
            return <p>Chargement de la facture...</p>;
        }
        switch (activeSection) {
            case 'general':
                return <GlobalForm formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} handleEmetteurChange={handleEmetteurChange} handleLogoChange={handleLogoChange} />;
            case 'client':
                return <ClientForm formData={formData} handleClientChange={handleClientChange} setFormData={setFormData} />;
            case 'articles':
                return <ArticlesForm formData={formData} handleItemChange={handleItemChange} addItem={addItem} removeItem={removeItem} setFormData={setFormData} packs={packs} onAddNewProduct={onAddNewProduct} />;
            case 'conditions':
                return <ConditionsForm formData={formData} handleInputChange={handleInputChange} handleSignatureChange={handleSignatureChange} />;
            case 'Aperçu':
                return <AperçuMobile formData={formData} calculateTotals={calculateTotals} handleSaveFact={handleSaveFact} handleShareFact={handleShareFact} />;
            default:
                return null;
        }
    };

    const totals = calculateTotals();

    return (
        <div className="flex h-screen">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} activeSection={activeSection} setActiveSection={setActiveSection} onSave={handleSaveFact} onShare={handleShareFact} />
            <div className="flex flex-1 flex-col md:flex-row">
                <div className="w-full md:w-1/3 p-6 bg-gray-50 overflow-y-auto">
                    <h2>{
                        {
                            'general': 'Informations générales',
                            'client': 'Détails du client',
                            'articles': 'Gestion des articles',
                            'conditions': 'Conditions de paiement',
                            'Aperçu': 'Aperçu'
                        }[activeSection]
                    }</h2>
                    {activeSection === 'Aperçu' ? <AperçuMobile formData={formData} calculateTotals={calculateTotals} handleSaveFact={handleSaveFact} handleShareFact={handleShareFact} /> : renderFormSection()}
                </div>
                <div className="hidden md:block w-full md:w-2/3 bg-white p-8 overflow-y-auto overflow-x-hidden shadow-inner">
                    <div className="max-w-4xl mx-auto bg-white p-8 border rounded-lg relative hide-scrollbar">
                        {formData.conditions.statut && <div className={`absolute inset-0 flex justify-center items-center opacity-10 text-8xl font-bold uppercase transform rotate-[-30deg] pointer-events-none ${formData.conditions.statut === "Payée" ? "text-green-500" : formData.conditions.statut === "Annulée" ? "text-red-500" : "text-yellow-500"}`}>{formData.conditions.statut}</div>}
                        <div className="flex justify-between items-start mb-8">
                            {formData.logo && <div className="w-48"><img src={formData.logo} alt="Logo entreprise" className="max-w-28 h-28 object-contain" /></div>}
                            <div className="text-right flex-1">
                                <h1>FACTURE</h1>
                                <p>Facture N°#{formData.numero}</p>
                                <p>Date : {formData.date.split('-').reverse().join('/')}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="border p-4 rounded-lg shadow-sm">
                                <h2>ÉMETTEUR</h2>
                                <div className="pt-2">
                                    <p className="font-bold text-dtr-dark">{formData.emetteur.nom || "Nom de l'émetteur ou de l'entreprise"}</p>
                                    <p className="text-dtr-dark">{formData.emetteur.adresse}</p>
                                    <p className="text-dtr-dark">{formData.emetteur.email}</p>
                                    <p className="text-dtr-dark">{formData.emetteur.telephone}</p>
                                </div>
                            </div>
                            <div className="border p-4 rounded-lg shadow-sm">
                                <h2>CLIENT</h2>
                                <div className="pt-2">
                                    <p className="font-bold text-dtr-dark">{formData.client.entreprise || 'À l’attention de'}</p>
                                    <p className="text-dtr-dark">{formData.client.nom}</p>
                                    <p className="text-dtr-dark">{formData.client.adresse}</p>
                                    <p className="text-dtr-dark">{formData.client.email}</p>
                                    <p className="text-dtr-dark">{formData.client.telephone}</p>
                                </div>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
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
                        <div className="flex justify-end mb-8">
                            <div className="w-64">
                                <div className="flex justify-between border-b py-2">
                                    <span>Total HT</span>
                                    <span>{totals.totalHT.toFixed(2)} XOF</span>
                                </div>
                                {formData.includeTva && (
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
                            {formData.conditions.commentaires && <p className="mt-2">{formData.conditions.commentaires}</p>}
                        </div>
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
                    <ToastContainer />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button onClick={handleSaveFact} disabled={isSaving} className={`p-2 bg-nextmux-green text-white rounded-md hover:bg-black flex items-center justify-center ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {isSaving ? 'Enregistrement...' : <><Save size={20} className="mr-1" />Sauvegarder</>}
                        </button>
                        <button onClick={handleShareFact} className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center"><Share size={20} className="mr-1" />Partager</button>
                        <button onClick={handleDownloadPDF} className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center" title="Télécharger en PDF"><Download size={20} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FactEditor;
