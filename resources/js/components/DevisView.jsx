// resources/js/components/DevisView.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Download, Share, Eye, ArrowRightCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

const DevisView = () => {
    const getQuoteIdFromURL = () => {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    };

    const id = getQuoteIdFromURL();
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isConverting, setIsConverting] = useState(false);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await axios.get(`/api/quotes/${id}`);
                console.log('Devis récupéré:', response.data);
                setQuote(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération du devis:', error);
                toast.error('Erreur lors de la récupération du devis.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuote();
    }, [id]);

    const calculateTotals = () => {
        if (!quote) return { totalHT: 0, totalTVA: 0, totalTTC: 0 };
        const totalHT = quote.items.reduce((sum, item) =>
            sum + (Number(item.quantite) * Number(item.prix)), 0);
        let totalTVA = 0;
        if (quote.include_tva) {
            totalTVA = quote.items.reduce((sum, item) =>
                sum + (Number(item.quantite) * Number(item.prix) * (Number(item.tva) / 100)), 0);
        }
        return {
            totalHT,
            totalTVA,
            totalTTC: totalHT + totalTVA
        };
    };

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        const previewElement = document.getElementById('devis-preview');
        if (!previewElement) {
            toast.error('Élément de prévisualisation non trouvé');
            setIsDownloading(false);
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
            pdf.save(`devis_${quote.numero}.pdf`);
            toast.success('PDF téléchargé avec succès !');
        } catch (error) {
            console.error('Erreur lors de la génération du PDF :', error);
            toast.error('Impossible de générer le PDF');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = () => {
        if (!quote) return;
        const shareData = {
            title: `Devis ${quote.numero}`,
            text: `Voici le devis #${quote.numero}.`,
            url: window.location.href,
        };
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => toast.success('Devis partagé avec succès !'))
                .catch((err) => console.error('Erreur lors du partage:', err));
        } else {
            navigator.clipboard.writeText(shareData.url)
                .then(() => toast.success('Lien copié dans le presse-papiers !'))
                .catch((err) => console.error('Erreur lors de la copie du lien:', err));
        }
    };

    const handleBack = () => {
        window.location.href = '/devis'; 
    };

    const handleConvertToInvoice = async () => {
        if (!quote) return;
        setIsConverting(true);

        try {
            const response = await axios.post(`/api/invoices/convert/${quote.id}`, {}, {
                withCredentials: true,
            });
            console.log("Facture créée à partir du devis :", response.data);
            toast.success("Le devis a été converti en facture avec succès !", {
                icon: '🎉',
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
            });
            const invoiceId = response.data.id;
            window.location.href = `/facture/${invoiceId}/edit`;
        } catch (error) {
            console.error("Erreur lors de la conversion du devis en facture :", error);
            toast.error("Impossible de convertir le devis en facture.");
        } finally {
            setIsConverting(false);
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500">Chargement du devis...</p>;
    }

    if (!quote) {
        return <p className="text-center text-gray-500">Devis non trouvé.</p>;
    }

    const totals = calculateTotals();

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Devis #{quote.numero}</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className={`p-2 bg-nextmux-green text-white rounded-md hover:bg-black flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Télécharger en PDF"
                    >
                        {isDownloading ? 'Téléchargement...' : <Download size={20} />}
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center"
                        title="Partager le devis"
                    >
                        <Share size={20} />
                    </button>
                    <button
                        onClick={handleBack}
                        className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center"
                        title="Retour à la liste des devis"
                    >
                        <Eye size={20} />
                    </button>

                    {/* Bouton pour convertir en facture */}
                    <button
                        onClick={handleConvertToInvoice}
                        disabled={isConverting}
                        className={`p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 flex items-center justify-center ${isConverting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Convertir ce devis en facture"
                    >
                        {isConverting ? 'Conversion...' : (
                            <>
                                <ArrowRightCircle size={20} className="mr-1" />
                                Convertir en Facture
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div id="devis-preview" className="bg-white p-8 border rounded-lg shadow">
                <div className="flex justify-between items-start mb-8">
                    {quote.logo_path && (
                        <div className="w-48">
                            <img src={`/storage/${quote.logo_path}`} alt="Logo entreprise" className="max-w-28 h-28 object-contain" />
                        </div>
                    )}
                    <div className="text-right flex-1">
                        <h1 className="text-2xl font-bold text-gray-800">DEVIS</h1>
                        <p className="text-gray-600">N° {quote.numero}</p>
                        <p className="text-gray-600">Date : {new Date(quote.date_emission).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Section ÉMETTEUR */}
                <div className="mb-8">
                    <h2 className="font-semibold mb-2 border-b pb-2">ÉMETTEUR</h2>
                    <div className="pt-2">
                        <p className="font-bold">{quote.emetteur.nom || 'Nom de l\'émetteur ou de l\'entreprise'}</p>
                        <p>{quote.emetteur.adresse}</p>
                        <p>{quote.emetteur.email}</p>
                        <p>{quote.emetteur.telephone}</p>
                    </div>
                </div>

                {/* Section CLIENT */}
                <div className="mb-8">
                    <h2 className="font-semibold mb-2 border-b pb-2">CLIENT</h2>
                    <div className="pt-2">
                        <p className="font-bold">{quote.client.entreprise || 'Entreprise non renseignée'}</p>
                        {/* Suppression de l'affichage de 'client.nom' */}
                        <p>{quote.client.adresse}</p>
                        <p>{quote.client.email}</p>
                        <p>{quote.client.telephone}</p>
                    </div>
                </div>

                <table className="w-full mb-8">
                    <thead className="bg-gray-50">
                        <tr className="border-b">
                            <th className="text-left p-2">Produit</th>
                            <th className="text-right p-2">Qté</th>
                            <th className="text-right p-2">Prix unitaire</th>
                            {quote.include_tva && <th className="text-right p-2">TVA</th>}
                            <th className="text-right p-2">Total HT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quote.items.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2">
                                    {item.product && (
                                        <>
                                            <div className="font-semibold">{item.product.name}</div>
                                            {item.product.description && (
                                                <div className="text-sm text-gray-500">{item.product.description}</div>
                                            )}
                                        </>
                                    )}
                                </td>
                                <td className="text-right p-2">{item.quantite}</td>
                                <td className="text-right p-2">{Number(item.prix).toFixed(2)} XOF</td>
                                {quote.include_tva && <td className="text-right p-2">{item.tva || 0}%</td>}
                                <td className="text-right p-2">
                                    {(Number(item.quantite) * Number(item.prix)).toFixed(2)} XOF
                                </td>
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
                        {quote.include_tva && (
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
                    <p>Mode de paiement : {quote.paiement}</p>
                    {quote.commentaires && (
                        <p className="mt-2">{quote.commentaires}</p>
                    )}
                </div>
                <div className="pt-4 flex justify-end">
                    <div className="text-right">
                        <h3 className="font-semibold mb-2">Signature</h3>
                        {quote.signature_path && (
                            <img
                                src={`/storage/${quote.signature_path}`}
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
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className={`p-2 bg-nextmux-green text-white rounded-md hover:bg-black flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Télécharger en PDF"
                >
                    {isDownloading ? 'Téléchargement...' : <Download size={20} />}
                </button>
                <button
                    onClick={handleShare}
                    className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center"
                    title="Partager le devis"
                >
                    <Share size={20} />
                </button>
                <button
                    onClick={handleBack}
                    className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center"
                    title="Retour à la liste des devis"
                >
                    <Eye size={20} />
                </button>
            </div>
        </div>
    );

};

export default DevisView;
